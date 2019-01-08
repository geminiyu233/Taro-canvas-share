import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import CanvasShare from '../../components/canvas-share'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  constructor () {
    super(...arguments)
    this.state = {
      motto: 'Hello World',
      userInfo: {},
      hasUserInfo: false,
      visible: false
    }
  }

  componentWillMount () {
  }

  getUserInfo = () => {
    
    // "appid": "wx3198f237bfaf08de",
    //2019010862799533
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.getUserInfo({
        success: res => {
          this.setState({
            userInfo: {
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            },
            hasUserInfo: true
          })
        }
      })
    } else if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      this.setState({
        userInfo: {
          avatarUrl: 'https://img.xiaomeipingou.com/_assets_home-share-bg.jpg',
          nickName: '喻又'
        },
        hasUserInfo: true
      })
    } else if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          my.getAuthUserInfo({
            success: (userInfo) => {
              this.setState({
                userInfo: {
                  avatarUrl: userInfo.avatar,
                  nickName: userInfo.nickName
                },
                hasUserInfo: true
              })
            }
          })
        }
      })
    }
  }

  //事件处理函数
  show = () => {
    this.setState({ visible: true })
  }

  close = () => {
    this.setState({ visible: false })
  }

  render () {
    let { hasUserInfo, userInfo, visible } = this.state
    return (
      <View className='index'>
        <CanvasShare onClick={this.close} userInfo={userInfo} visible={visible}></CanvasShare>
        <View className="userinfo">
          {
            !hasUserInfo && <Button open-type="getUserInfo" onClick={this.getUserInfo}> 获取头像昵称 </Button>
          }
          {
            hasUserInfo && (
              <View>
                <View className="userinfo-avatar"><Image className='img' onClick={this.show} src={userInfo.avatarUrl} mode="widthFix" /></View>
                <View className="userinfo-nickname"><Text>{userInfo.nickName}</Text></View>
              </View>
            )
          }
        </View>
        <View className="usermotto">
          {
            hasUserInfo && <View className="user-motto"><Text>点击头像演示分享</Text></View>
          }
          {
            !hasUserInfo && <View className="user-motto"><Text>点击上方按钮获取头像</Text></View>
          }
        </View>
      </View>
    )
  }
}

