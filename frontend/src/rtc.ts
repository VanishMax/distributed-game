// TODO: https://github.com/jkithome/simple-webrtc-chat-app/blob/master/src/Chat.js
// TODO: https://github.com/jkithome/signalling-server/blob/master/index.js

import type { Socket } from 'socket.io-client';

const setupRtc = (socket: Socket) => {
  const peerConn = new RTCPeerConnection({
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302',
    }, {
      urls: 'stun:stun1.l.google.com:19302',
    }],
  });

  socket.on('login', () => {
    peerConn.ondatachannel = (event) => {
      // dataChannel = event.channel;
      // onDataChannelCreated(dataChannel);
      event.channel.onmessage = (messageEvent) => {
        console.log('channel message', messageEvent);
      };
    };
  });

  socket.on('answer', (answer) => {
    peerConn.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('offer', (offer) => {
    peerConn
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => peerConn.createAnswer())
      .then(answer => peerConn.setLocalDescription(answer))
      .then(() => socket.emit('answer', { answer: peerConn.localDescription }))
      .catch(() => console.error('Failed connection'))
  });

  socket.on('candidate', (candidate) => {
    peerConn.addIceCandidate(new RTCIceCandidate(candidate));
  });

  socket.on('updateUsers', () => {

  });

  // ICE candidate is user's IP
  peerConn.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', {
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    }
  };

  const createConnection = () => {
    const dataChannel = peerConn.createDataChannel('game');
    dataChannel.onerror = () => {
      console.log('CHANNEL error!!!');
    };
    dataChannel.onopen = () => {
      console.log('CHANNEL opened!!!');
    };
    dataChannel.onclose = () => {
      console.log('Channel closed.');
    }
    dataChannel.onmessage = (event) => {
      console.log('data message', event);
    };

    peerConn.createOffer()
      .then((offer) => peerConn.setLocalDescription(offer))
      .then(() => socket.emit('offer', peerConn.localDescription));
  };
};

export default setupRtc;
