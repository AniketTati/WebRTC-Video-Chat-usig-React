import React , { Component } from 'react';

class App extends Component{

  constructor(){
    super()
    
    // Create A refrence for DOM video
    this.localVideoref = React.createRef()
  }

  render(){
    // create constriants for data to be accessed
    // in our case its only webcam so video
    const constriants = { video: true }
    
    // Method Called when User media is received
    const success = (stream) => {
      this.localVideoref.current.srcObject = stream
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

    return (
      <div>
       <h1>Read Webcam Video Data!</h1>
       <video ref={this.localVideoref} autoPlay></video>
      </div>
    )
  }
  
}

export default App;
