import Taro, { Component } from '@tarojs/taro'
import { View, Image, Canvas } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

function randomStr(long) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const maxPos = chars.length;
  var string = '';
  //生成随机的字符串
  for (var i = 0; i < long; i++) {
    // charAt()返回指定位置的字符
    string += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return string;
}

function convertBase64UrlToBlob(urlData,type){
  var bytes=window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length)
  var ia = new Uint8Array(ab)
  for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
  }
  return new Blob( [ab] , {type : 'image/'+type})
}

function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    Taro.getImageInfo({
      src: url,
      success: resolve,
      fail: reject
    })
  })
}

function createRpx2px() {
  const { windowWidth } = Taro.getSystemInfoSync()

  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px()

function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      ...option,
      success: resolve,
      fail: reject
    }, context)
  })
}

function saveImageToPhotosAlbum(option) {
  return new Promise((resolve, reject) => {
    Taro.saveImageToPhotosAlbum({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}

class CanvasShare extends Component {

  constructor (props) {
    super(props)
    this.state = {
      beginDraw: false,
      isDraw: false,

      canvasWidth: 843,
      canvasHeight: 1500,

      imageFile: '',
      visible: props.visible,

      responsiveScale: 1,
      id: `share-${randomStr(16)}`
    }
  }
  static defaultProps = {
    visible: false,
    userInfo: {}
  }

  static propTypes = {
    userInfo: PropTypes.object,
    visible: PropTypes.bool,
    onClick: PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    }, () => {
      if (this.state.visible && !this.state.beginDraw) {
        this.draw()
        this.setState({
          beginDraw: true
        })
      }
    })
  }

  componentDidMount = () => {
    const designWidth = 375
    const designHeight = 603 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

    // 以iphone6为设计稿，计算相应的缩放比例
    const { windowWidth, windowHeight } = Taro.getSystemInfoSync()
    const responsiveScale =
      windowHeight / ((windowWidth / designWidth) * designHeight)
    if (responsiveScale < 1) {
      this.setState({
        responsiveScale: responsiveScale
      })
    }
  }

  onClick (e) {
    this.props.onClick(e, ...arguments)
  }

  draw = () => {
    Taro.showLoading()
    const { canvasWidth, canvasHeight } = this.state
    const { avatarUrl, nickName } = this.props.userInfo
    
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      const ctx = document.getElementById('share').getContext('2d')

      // 绘制背景(绘制图片到背景)
      const canvasW = rpx2px(canvasWidth * 2)
      const canvasH = rpx2px(canvasHeight * 2)
      let bgImg = new Image()
      bgImg.src = 'https://img.xiaomeipingou.com/_assets_home-share-bg.jpg'
      bgImg.crossOrigin="anonymous"
      bgImg.onload = function(){
        console.log(1)
        ctx.globalCompositeOperation="destination-over" //source-over
        ctx.drawImage(
          bgImg,
          0,
          0,
          canvasW,
          canvasH
        )
      }

      // 绘制头像
      const radius = rpx2px(90 * 2)
      const y = rpx2px(120 * 2)
      let avatarImg = new Image()
      avatarImg.src = 'https://img.xiaomeipingou.com/_assets_home-share-bg.jpg'
      avatarImg.crossOrigin="anonymous"
      avatarImg.onload = function(){
        ctx.globalCompositeOperation="source-over" //source-over
        ctx.drawImage(
          avatarImg,
          canvasW / 2 - radius,
          y - radius,
          radius * 2,
          radius * 2,
        )
      }
      
      // 绘制用户名
      ctx.font = '60px'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(
        nickName,
        canvasW / 2,
        y + rpx2px(150 * 2)
      )
      ctx.stroke()

      let canvas = document.getElementById('share')
      let dataURL = canvas.toDataURL("image/png", 1.0)
      // const imageFile = convertBase64UrlToBlob(dataURL, "png")
      
      console.log('dataURL', dataURL)
      this.setState({ imageFile: dataURL })
    } else {
      // 绘制背景(绘制图片到背景)
      const avatarPromise = getImageInfo(avatarUrl)
      const backgroundPromise = getImageInfo('https://img.xiaomeipingou.com/_assets_home-share-bg.jpg')

      Promise.all([avatarPromise, backgroundPromise])
        .then(([avatar, background]) => {
          //调用一些 API 需要传入原生小程序的页面或者组件实例时，可以直接传入 this.$scope
          //具体参考：https://nervjs.github.io/taro/docs/wx-relations.html
          const ctx = Taro.createCanvasContext(Taro.getEnv() === Taro.ENV_TYPE.WEAPP ? 'share' : this.state.id, this.$scope)
          const canvasW = rpx2px(canvasWidth * 2)
          const canvasH = rpx2px(canvasHeight * 2)

          // 绘制背景(绘制图片到背景)
          ctx.drawImage(
            background.path,
            0,
            0,
            canvasW,
            canvasH
          )

          // 绘制头像
          const radius = rpx2px(90 * 2)
          const y = rpx2px(120 * 2)
          ctx.drawImage(
            avatar.path,
            canvasW / 2 - radius,
            y - radius,
            radius * 2,
            radius * 2,
          )

          // 绘制用户名
          ctx.setFontSize(60)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#ffffff')
          ctx.fillText(
            nickName,
            canvasW / 2,
            y + rpx2px(150 * 2)
          )
          ctx.stroke()

          ctx.draw(false, setTimeout(() => {
            if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
              canvasToTempFilePath({
                canvasId: 'share',
              }, this.$scope).then(({ tempFilePath }) => {
                this.setState({ imageFile: tempFilePath })
              })
            } else if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
              //支付宝小程序需要真机调试才能看见图片
              const _this = this
              ctx.toTempFilePath({
                success(tempFilePath) {
                  _this.setState({ imageFile: tempFilePath.apFilePath })
                }
              })
            } else if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {

            }
          }, 200))

          Taro.hideLoading()
          this.setState({ isDraw: true })
        })
        .catch(() => {
          this.setState({ beginDraw: false })
          Taro.hideLoading()
        })
      }
    
  }

  
  handleClose = () => {
    this.props.onClick()
  }

  handleSave = () => {
    const { imageFile } = this.state

    if (imageFile) {
      saveImageToPhotosAlbum({
        filePath: imageFile,
      }).then(() => {
        Taro.showToast({
          icon: 'none',
          title: '分享图片已保存至相册',
          duration: 2000,
        })
      })
    }
  }

  h5Canvas = (canvas) => {
    this.canvas = canvas
  }

  render () {
    const { canvasWidth, canvasHeight, responsiveScale, imageFile, id } = this.state
    let { visible } = this.props
    let canvasWH = `width:${canvasWidth*2}rpx;height:${canvasHeight*2}rpx`
    let transform = `transform:scale(${responsiveScale});-webkit-transform:scale(${responsiveScale});`
    let ImageW = `width:${canvasWidth/3*2}rpx`
    let ImageWH = `${ImageW};height:${canvasHeight/3*2}rpx`
    let rootClass = classNames(
      'share',
      {
        'show': visible
      }
    )
    return (
      <View className={rootClass}>
        {
          Taro.getEnv() === Taro.ENV_TYPE.WEB && <canvas ref={this.h5Canvas} id='share' className='canvas-hide' style={canvasWH}></canvas>
        }
        {
          Taro.getEnv() !== Taro.ENV_TYPE.WEB && <Canvas className='canvas-hide' style={canvasWH} canvasId='share' id={id} />
        }
        <View className="content" style={transform}>
          <Image className="canvas" src={imageFile} style={ImageWH} />
          <View className="footer" style={ImageW}>
            <View className="save" onClick={this.handleSave}>保存到相册</View>
            <View className="close" onClick={this.handleClose}>关闭</View>
          </View>
        </View>
      </View>
    )
  }
}

export default CanvasShare
