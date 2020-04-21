import React , { Component } from 'react';

class App extends Component{

  constructor(){
    super()
    
    // Create A refrence for DOM video
    this.localVideoref = React.createRef()
    this.remoteVideoref = React.createRef()
  }

  componentDidMount(){
    
    // Config for RTCPeerConnection
    const pc_config = null

    // const pc_config ={
    //   "iceServers": [
    //     {
    //       urls: 'stun:[STUN-IP]:[PORT]',
    //       'credential': '[YOUR CREDENTIAL]',
    //       'username': '[USERNAME]'
    //     }
    //   ]
    // }

    // create var to establish connection between two peers
    this.pc = new RTCPeerConnection(pc_config)

    this.pc.onicecandidate = (e) => {
       if (e.candidate) console.log(JSON.stringify(e.candidate))
    }

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e)
    }

    this.pc.onaddstream = (e) => {
      this.remoteVideoref.current.srcObject = e.stream
    }

    // create constriants for data to be accessed
    // in our case its only webcam so video
    const constriants = { video: true }
    
    // Method Called when User media is received
    const success = (stream) => {
      window.localStream = stream
      this.localVideoref.current.srcObject = stream
      this.pc.addStream(stream)
    }
    
    // Method to show error while requesting user media
    const failure = (e) => {
      console.log('getUserMedia Error', e)
    }
    
    // Access User media using promise
    // this method asks for user permission on browser 
    navigator.mediaDevices.getUserMedia( constriants )
      .then( success )
      .catch( failure )
  }

  createOffer = () => {
    console.log('Offer')
    this.pc.createOffer({offerToReceiveVideo: 1})
      .then(sdp => {
        console.log(JSON.stringify(sdp))
        this.pc.setLocalDescription(sdp)
      }, e => {})
  }

  setRemoteDescription = () => {
    const desc = JSON.parse(this.textref.value)

    this.pc.setRemoteDescription(new RTCSessionDescription(desc))
  }

  createAnswer = () => {
    console.log('Answer')
    this.pc.createAnswer({offerToReceiveVideo: 1})
      .then(sdp => {
        console.log(JSON.stringify(sdp))
        this.pc.setLocalDescription(sdp)
      }, e => {})
  }

  addCandidate = () => {
    const candidate = JSON.parse(this.textref.value)
    console.log('Adding candidate:', candidate)

    this.pc.addIceCandidate(new RTCIceCandidate(candidate))
  }

  render(){    

    return (
      <div>
       <h1>Read Webcam Video Data!</h1>
       <video 
          style ={{
              width: 200 , height: 200,
              margin: 5 , backgroundColor: 'black'
          }}
          ref={this.localVideoref} 
          autoPlay></video>

       <video 
          style ={{
              width: 200 , height: 200,
              margin: 5 , backgroundColor: 'black'
          }}
          ref={this.remoteVideoref} 
          autoPlay></video>

        <br />
        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnswer}>Answer</button>
        <br />
        <textarea ref={ref => { this.textref = ref }} />
        <br />
        <button onClick={this.setRemoteDescription}>Set Remote Desc</button>
        <button onClick={this.addCandidate}>Add Candidate</button>

      </div>
    )
  }
  
}

export default App;
