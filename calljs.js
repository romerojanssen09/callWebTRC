function makeCall2(){
    let callee = document.querySelector('#callee').value;
    // Generate a random code for callee
    const randomCode = generateRandomCode(10);
    
    // Display the generated code on the page
    document.querySelector('#code').textContent = randomCode;

    // Initialize peer with random code
    init(randomCode);

    // Make a call to the callee
    makeCall(callee);
}


function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result+"";
}

// Example usage
const randomCode = generateRandomCode(10); // Generates a random code of length 10
//console.log(randomCode);

function generateCalleeCode() {
    document.querySelector('#code').textContent = randomCode;
    init(randomCode);
}


var peer = new Peer()
var myStream
var peerList = []


//this function will be initiating the peer
function init(userId){
  peer = new Peer(userId)
  peer.on('open',(id)=>{
    console.log(id+" connected") //if we connect successfully this will print
  })

  listenToCall()
}


//this function will keep listening to call or incoming events
function listenToCall(){
  peer.on('call',(call)=>{
    navigator.mediaDevices.getUserMedia({
      video:true,
      audio: true
    }).then((stream)=>{

      myStream = stream
      addLocalVideo(stream)
      call.answer(stream)
      call.on('stream',(remoteStream)=>{
        if(!peerList.includes(call.peer)){
          addRemoteVideo(remoteStream)
          peerList.push(call.peer)
        }
      })
    }).catch((err)=>{
      console.log("unable to connect because "+err)
    })
  })
}

//this function will be called when we try to make a call
function makeCall(receiverId){
    navigator.mediaDevices.getUserMedia({
      video:true,
      audio: true
    }).then((stream)=>{
      myStream = stream
      addLocalVideo(stream)
      let call = peer.call(receiverId,stream)
      call.on('stream',(remoteStream)=>{
        if(!peerList.includes(call.peer)){
          addRemoteVideo(remoteStream)
          peerList.push(call.peer)
        }
      })
    }).catch((err)=>{
      console.log("unable to connect because "+err)
    })

}

//this function will add local stream to video pannel
function addLocalVideo(stream){
  let video = document.createElement("video")
  video.srcObject = stream
  video.classList.add("video")
  video.muted = true // local video need to be mute because of noise issue
  video.play()
  document.getElementById("localVideo").append(video)
}

//this function will add remote stream to video pannel
function addRemoteVideo(stream){
  let video = document.createElement("video")
  video.srcObject = stream
  video.classList.add("video")
  video.play()
  document.getElementById("remoteVideo").append(video)
}



//so far video call is working fine.. lets toggle the video or audio
function toggleVideo(b){
  if(b=="true"){
    myStream.getVideoTracks()[0].enabled = true
  }
  else{
    myStream.getVideoTracks()[0].enabled = false
  }
}

//toggle audio
function toggleAudio(b){
  if(b=="true"){
    myStream.getAudioTracks()[0].enabled = true
  }
  else{
    myStream.getAudioTracks()[0].enabled = false
  }
}
