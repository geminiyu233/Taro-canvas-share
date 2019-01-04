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
    // 在没有 open-type=getUserInfo 版本的兼容处理
    Taro.getUserInfo({
      success: res => {
        console.log('res', res)
        this.setState({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
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
            !hasUserInfo && <Button open-type="getUserInfo" onGetUserInfo={this.getUserInfo}> 获取头像昵称 </Button>
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

