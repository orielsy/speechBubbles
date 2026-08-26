<template>
  <div class="transcription">
    <div>
      <button
        :class="{ connected: connectionOpen }"
        @click="connectWhisper">
        {{ !connectionOpen ? 'Connect' : 'Disconnect' }}
      </button>
      <button
        :class="{ recording: recordingStarted }"
        :disabled="!connectionOpen"
        @click="!recordingStarted ? startRecording() : stopRecording()">
        {{ !recordingStarted ? 'Start' : 'Stop' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useStore } from '@/stores/chatterStore';

const store = useStore();

const connectionOpen = ref(false);
const recordingStarted = ref(false);

let context = null;
let websocket = null;
let processor = null;
let globalStream = null;
const bufferSize = 4096;
const TARGET_SAMPLING_RATE = 16000; // Native Whisper sampling rate

onUnmounted(() => {
  stopRecording();
  if (websocket) {
    websocket.close();
  }
});

function connectWhisper() {
  if (connectionOpen.value === true) {
    if (websocket) websocket.close();
    recordingStarted.value = false;
    return;
  }
  const websocketAddress = 'ws://localhost:8000/listen';

  websocket = new WebSocket(websocketAddress);
  websocket.binaryType = 'arraybuffer';

  websocket.onopen = () => {
    connectionOpen.value = true;
    console.log('WebSocket connection established with Whisper API');
  };

  websocket.onclose = (event) => {
    connectionOpen.value = false;
    recordingStarted.value = false;
    console.log('WebSocket connection closed', event);
  };

  websocket.onerror = (error) => {
    console.error('WebSocket encountered an error:', error);
  };

  websocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.segments && Array.isArray(data.segments)) {
        filterSegments(data.segments);
      } else if (data.text) {
        store.captions.push(data.text);
      }
    } catch (err) {
      console.warn('Received non-JSON message:', event.data);
    }
  };
}

// Filters out segments with high hallucination probability or low confidence
function filterSegments(segments) {
  for (let x = 0; x < segments.length; x += 1) {
    const seg = segments[x];
    const noSpeech = seg.no_speech_prob ?? 0;
    const temp = seg.temperature ?? 0;
    if (noSpeech <= 0.6 && temp <= 0.8 && seg.text?.trim()) {
      store.captions.push(seg.text.trim());
    }
  }
}

function startRecording() {
  recordingStarted.value = true;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  context = new AudioContextClass();
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      globalStream = stream;
      const input = context.createMediaStreamSource(stream);
      processor = context.createScriptProcessor(bufferSize, 1, 1);
      processor.onaudioprocess = (e) => processAudio(e);
      input.connect(processor);
      processor.connect(context.destination);
    })
    .catch((error) => {
      recordingStarted.value = false;
      console.error('Microphone capture error:', error);
    });
}

function stopRecording() {
  recordingStarted.value = false;

  if (globalStream) {
    globalStream.getTracks().forEach((track) => track.stop());
    globalStream = null;
  }
  if (processor) {
    processor.disconnect();
    processor = null;
  }
  if (context) {
    context.close().then(() => (context = null));
  }
}

function processAudio(e) {
  if (!context) return;
  const inputSampleRate = context.sampleRate;

  const left = e.inputBuffer.getChannelData(0);
  const downsampledBuffer = downsampleBuffer(left, inputSampleRate, TARGET_SAMPLING_RATE);
  const audioData = convertFloat32ToInt16(downsampledBuffer);

  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(audioData);
  }
}

function downsampleBuffer(buffer, inputSampleRate, outputSampleRate) {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }
  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) {
    const s = Math.max(-1, Math.min(1, buffer[l]));
    buf[l] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return buf.buffer;
}
</script>

<style lang="scss" scoped>
.transcription {
  padding-right: 20px;
  & div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  flex-direction: column;

  textarea {
    width: 100%;
  }
}
button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background: white;
  font-size: 16px;
  padding: 8px 4px;
  outline: none;
  min-width: 100px;
  &:hover {
    background: #ccc;
  }
  &:first-of-type {
    margin-right: 4px;
  }
  &.connected {
    color: #fff;
    background: #198c19;
  }
  &.recording {
    background: red;
    color: #fff;
  }
}
</style>
