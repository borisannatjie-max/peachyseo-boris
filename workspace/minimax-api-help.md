# MiniMax API Help Documentation

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

---

## Table of Contents

1. [SDK Installation](#1-sdk-installation)
2. [Environment Configuration](#2-environment-configuration)
3. [Basic Conversation](#3-basic-conversation)
4. [Tool Calling (Function Calling)](#4-tool-calling-function-calling)
5. [Streaming Responses](#5-streaming-responses)
6. [Image Generation](#6-image-generation)
7. [Video Generation](#7-video-generation)
8. [Text-to-Speech](#8-text-to-speech)
9. [Voice Cloning](#9-voice-cloning)
10. [Music Generation](#10-music-generation)
11. [File Management](#11-file-management)
12. [Error Codes](#12-error-codes)

---

## 1. SDK Installation

### Install Anthropic SDK

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Installs the Anthropic SDK for Python and Node.js using pip and npm respectively. Ensure you have Python and Node.js installed.

```bash
pip install anthropic
```

```bash
npm install @anthropic-ai/sdk
```

---

### Install OpenAI SDK

Source: https://platform.minimax.io/docs/api-reference/text-openai-api

Install the OpenAI SDK for Python or Node.js using pip or npm respectively. This is the first step to integrating MiniMax models via the OpenAI API.

```python
pip install openai
```

```bash
npm install openai
```

---

## 2. Environment Configuration

### Configure Environment Variables for Anthropic API (Bash)

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Sets the ANTHROPIC_BASE_URL to the MiniMax API endpoint and configures the ANTHROPIC_API_KEY. Replace ${YOUR_API_KEY} with your actual MiniMax API key.

```bash
export ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic
export ANTHROPIC_API_KEY=${YOUR_API_KEY}
```

---

### Configure Environment Variables for OpenAI SDK

Source: https://platform.minimax.io/docs/api-reference/text-openai-api

Set the OPENAI_BASE_URL to the MiniMax API endpoint and provide your OPENAI_API_KEY. These environment variables are necessary for the OpenAI SDK to connect to MiniMax services.

```python
export OPENAI_BASE_URL=https://api.minimax.io/v1
export OPENAI_API_KEY=${YOUR_API_KEY}
```

```bash
export OPENAI_BASE_URL=https://api.minimax.io/v1
export OPENAI_API_KEY=${YOUR_API_KEY}
```

---

## 3. Basic Conversation

### Basic Conversation Example with OpenAI SDK

Source: https://platform.minimax.io/docs/api-reference/text-openai-api

Initiate a basic conversation with a MiniMax model using the OpenAI SDK. This example shows how to send a user's message and retrieve a direct response.

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
 model="MiniMax-M2",
 messages=[
 {
 "role": "user",
 "content": "Explain machine learning in simple terms"
 }
 ]
)

print(response.choices[0].message.content)
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
 model: "MiniMax-M2",
 messages: [
 {
 role: "user",
 content: "Explain machine learning in simple terms",
 },
 ],
});

console.log(response.choices[0].message.content);
```

---

### Basic Conversation Example (Anthropic SDK)

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Demonstrates how to perform a basic conversation with the API using Python and Node.js.

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
 model="MiniMax-M2",
 max_tokens=1024,
 messages=[
 {
 "role": "user",
 "content": "Explain machine learning in simple terms"
 }
 ]
)

print(message.content[0].text)
```

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
 model: "MiniMax-M2",
 max_tokens: 1024,
 messages: [
 {
 role: "user",
 content: "Explain machine learning in simple terms",
 },
 ],
});

console.log(message.content[0].text);
```

---

### Call MiniMax API using Anthropic SDK (Python/Node.js)

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Demonstrates how to call the MiniMax API using the Anthropic SDK. It initializes the client, sends a message to the 'MiniMax-M2' model, and prints the response. Ensure the Anthropic SDK is installed and environment variables are set.

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
 model="MiniMax-M2",
 max_tokens=1000,
 system="You are a helpful assistant.",
 messages=[
 {
 "role": "user",
 "content": [
 {
 "type": "text",
 "text": "Hi, how are you?"
 }
 ]
 }
 ]
)
print(message.content)
```

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
 model: "MiniMax-M2",
 max_tokens: 1000,
 System: "You are a helpful assistant.",
 messages: [
 {
 role: "user",
 content: [
 {
 type: "text",
 text: "Hi, how are you?",
 },
 ],
 },
 ],
});

console.log(message.content);
```

---

### Chat Completion Request Example (JSON)

Source: https://platform.minimax.io/docs/api-reference/text-post

An example JSON payload for initiating a chat completion request. It specifies the model to use and provides a sample message history.

```json
{
 "model": "MiniMax-M1",
 "messages": [
 {
 "role": "system",
 "name": "MiniMax AI"
 },
 {
 "role": "user",
 "name": "user",
 "content": "hello"
 }
 ]
}
```

---

### Streaming Chat Completion Request Example (JSON)

Source: https://platform.minimax.io/docs/api-reference/text-post

An example JSON payload for a streaming chat completion request. This enables receiving response chunks as they are generated, along with usage statistics if included.

```json
{
 "model": "MiniMax-M1",
 "messages": [
 {
 "role": "system",
 "name": "MiniMax AI"
 },
 {
 "role": "user",
 "name": "user",
 "content": "hello"
 }
 ],
 "stream": true
}
```

---

## 4. Tool Calling (Function Calling)

### Important Notes

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Key considerations and important notes for using the MiniMax Platform API, including model compatibility, API key setup, and parameter constraints.

> **Model Compatibility**: The Anthropic API compatibility interface currently only supports the `MiniMax-M2` model.
> **Base URL Configuration**: Set `ANTHROPIC_BASE_URL` to `https://api.minimax.io/anthropic` when using the API.
> **API Key**: Set `ANTHROPIC_API_KEY` to your MiniMax API Key.
> **Temperature Parameter**: The `temperature` parameter range is (0.0, 1.0]. Values outside this range will result in an error.
> **Ignored Parameters**: Some Anthropic parameters (such as `thinking`, `top_k`, `stop_sequences`, `service_tier`, `mcp_servers`, `context_management`, `container`) will be ignored.
> **Unsupported Inputs**: Image and document type inputs are not currently supported.

---

### Tool Calling Example (OpenAI SDK)

Source: https://platform.minimax.io/docs/api-reference/text-openai-api

Demonstrates how to define tools for function calling and make a chat completion request using the MiniMax API. This includes setting up the OpenAI client, defining the tool schema with function name, description, and parameters, and sending the request with a user message. The output shows the model's response, which may include a tool call.

```python
from openai import OpenAI

client = OpenAI()

tools = [
 {
 "type": "function",
 "function": {
 "name": "get_weather",
 "description": "Get weather information for a specified city",
 "parameters": {
 "type": "object",
 "properties": {
 "city": {
 "type": "string",
 "description": "City name"
 }
 },
 "required": ["city"]
 }
 }
 }
]

response = client.chat.completions.create(
 model="MiniMax-M2",
 messages=[
 {
 "role": "user",
 "content": "What's the weather like in Beijing today?"
 }
 ],
 tools=tools
)

print(response.choices[0].message)
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const tools = [
 {
 type: "function",
 function: {
 name: "get_weather",
 description: "Get weather information for a specified city",
 parameters: {
 type: "object",
 properties: {
 city: {
 type: "string",
 description: "City name",
 },
 },
 required: ["city"],
 },
 },
 },
];

const response = await client.chat.completions.create({
 model: "MiniMax-M2",
 messages: [
 {
 role: "user",
 content: "What's the weather like in Beijing today?",
 },
 ],
 tools: tools,
});

console.log(response.choices[0].message);
```

---

### Tool Calling (Function Calling) Example

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Provides an example of how to enable and use tool calling (function calling) with the API.

### Python

```python
import anthropic

client = anthropic.Anthropic()

tools = [
 {
 "name": "get_weather",
 "description": "Get weather information for a specified city",
 "input_schema": {
 "type": "object",
 "properties": {
 "city": {
 "type": "string",
 "description": "City name"
 }
 },
 "required": ["city"]
 }
 }
]

message = client.messages.create(
 model="MiniMax-M2",
 max_tokens=1024,
 tools=tools,
 messages=[
 {
 "role": "user",
 "content": "What's the weather like in Beijing today?"
 }
 ]
)

print(message.content)
```

### Node.js

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools = [
 {
 name: "get_weather",
 description: "Get weather information for a specified city",
 input_schema: {
 type: "object",
 properties: {
 city: {
 type: "string",
 description: "City name",
 },
 },
 required: ["city"],
 },
 },
];

const message = await client.messages.create({
 model: "MiniMax-M2",
 max_tokens: 1024,
 tools: tools,
 messages: [
 {
 role: "user",
 content: "What's the weather like in Beijing today?",
 },
 ],
});

console.log(message.content);
```

---

## 5. Streaming Responses

### Streaming Response Example (Anthropic SDK)

Source: https://platform.minimax.io/docs/api-reference/text-anthropic-api

Illustrates how to receive a streaming response from the API for continuous output.

### Python

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
 model="MiniMax-M2",
 max_tokens=1024,
 messages=[
 {
 "role": "user",
 "content": "Write a poem about spring"
 }
 ]
) as stream:
 for text in stream.text_stream:
 print(text, end="", flush=True)
```

### Node.js

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = await client.messages.stream({
 model: "MiniMax-M2",
 max_tokens: 1024,
 messages: [
 {
 role: "user",
 content: "Write a poem about spring",
 },
 ],
});

for await (const chunk of stream) {
 if (
 chunk.type === "content_block_delta" &&
 chunk.delta.type === "text_delta"
 ) {
 process.stdout.write(chunk.delta.text);
 }
}
```

---

### Streaming Response Example with OpenAI SDK

Source: https://platform.minimax.io/docs/api-reference/text-openai-api

Handle streaming responses from MiniMax models using the OpenAI SDK. This allows for real-time processing of generated content, such as poems or longer text.

```python
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
 model="MiniMax-M2",
 messages=[
 {
 "role": "user",
 "content": "Write a poem about spring"
 }
 ],
 stream=True
)

for chunk in stream:
 if chunk.choices[0].delta.content:
 print(chunk.choices[0].delta.content, end="", flush=True)
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const stream = await client.chat.completions.create({
 model: "MiniMax-M2",
 messages: [
 {
 role: "user",
 content: "Write a poem about spring",
 },
 ],
 stream: true,
});

for await (const chunk of stream) {
 if (chunk.choices[0].delta.content) {
 process.stdout.write(chunk.choices[0].delta.content);
 }
}
```

---

## 6. Image Generation

### Image Generation Request Example

Source: https://platform.minimax.io/docs/api-reference/image-generation-t2i

This example demonstrates how to make an image generation request. It specifies the model, prompt, aspect ratio, response format, number of images, and prompt optimization settings.

```yaml
model: image-01
prompt: >-
 A man in a white t-shirt, full-body, standing front view,
outdoors, with the Venice Beach sign in the background, Los
Angeles. Fashion photography in 90s documentary style, film
grain, photorealistic.
aspect_ratio: '16:9'
response_format: url
'n': 3
prompt_optimizer: true
```

---

### POST /v1/image_generation

Source: https://platform.minimax.io/docs/api-reference/image-generation-t2i

Generates images based on a text prompt using specified models and parameters. Supports various aspect ratios, dimensions, and output formats.

### Request Example

```json
{
 "model": "image-01",
 "prompt": "A majestic dragon soaring through a sunset sky",
 "aspect_ratio": "16:9",
 "n": 2
}
```

### Response Example

```json
{
 "code": "200",
 "msg": "Success",
 "data": {
 "items": [
 {
 "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
 "url": "https://example.com/image.png"
 }
 ]
 }
}
```

---

## 7. Video Generation

### Create Video Generation Task (General)

Source: https://platform.minimax.io/docs/api-reference/video-generation-intro

Initiates a video generation task using one of the supported models. Returns a unique task ID upon successful initiation.

### Request Example

```json
{
 "model": "MiniMax-Hailuo-2.3",
 "prompt": "A majestic dragon soaring through a stormy sky, cinematic lighting.",
 "images": [],
 "output_settings": {
 "resolution": "1080p",
 "duration_seconds": 5
 }
}
```

---

### POST /v1/video_generation (Text-to-Video)

Source: https://platform.minimax.io/docs/api-reference/video-generation-t2v

Generates a video based on a provided text prompt and model configuration. Supports advanced camera movement controls and prompt optimization.

### Request Example

```json
{
 "model": "MiniMax-Hailuo-2.3",
 "prompt": "A cinematic shot of a futuristic city at sunset, [Pan left,Pedestal up]",
 "duration": 6,
 "resolution": "1080P",
 "callback_url": "https://example.com/callback"
}
```

### Response Example

```json
{
 "code": 0,
 "msg": "Success",
 "data": {
 "video_id": "v_xxxxxxxxxxxxxx",
 "video_url": "https://example.com/videos/generated_video.mp4"
 }
}
```

---

### POST /v1/video_generation (Image-to-Video)

Source: https://platform.minimax.io/docs/api-reference/video-generation-i2v

Generates a video from a given image and text prompt. Supports various models and offers advanced camera control through command syntax.

### Request Example

```json
{
 "model": "MiniMax-Hailuo-2.3",
 "first_frame_image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
 "prompt": "A cat walking on a beach, [Push in]",
 "duration": 10,
 "resolution": "768P"
}
```

### Response Example

```json
{
 "code": "200000",
 "message": "Success",
 "data": {
 "id": "vgen_abc123xyz",
 "video_url": "https://storage.minimax.io/video/abc123xyz.mp4",
 "cover_image_url": "https://storage.minimax.io/image/abc123xyz.jpg"
 }
}
```

---

### Query Video Generation Task Status

Source: https://platform.minimax.io/docs/api-reference/video-generation-intro

Checks the status of an ongoing video generation task using its unique task ID.

```
GET /api/video-generation/query/a1b2c3d4e5f67890
```

### Response Example

```json
{
 "status": "success",
 "file_id": "video_file_xyz789"
}
```

---

## 8. Text-to-Speech

### Text-to-Speech Request (Non-streaming)

Source: https://platform.minimax.io/docs/api-reference/speech-t2a-http

Example of a non-streaming Text-to-Speech API request.

```json
{
 "model": "speech-2.6-hd",
 "text": "Omg, the real danger is not that computers start thinking like people, but that people start thinking like computers. Computers can only help us with simple tasks.",
 "stream": false,
 "language_boost": "auto",
 "output_format": "hex",
 "voice_setting": {
 "voice_id": "English_expressive_narrator",
 "speed": 1,
 "vol": 1,
 "pitch": 0
 },
 "pronunciation_dict": {
 "tone": [
 "Omg/Oh my god"
 ]
 },
 "audio_setting": {
 "sample_rate": 32000,
 "bitrate": 128000,
 "format": "mp3",
 "channel": 1
 },
 "voice_modify": {
 "pitch": 0,
 "intensity": 0,
 "timbre": 0,
 "sound_effects": "spacious_echo"
 }
}
```

---

### Text-to-Speech Request (Streaming)

Source: https://platform.minimax.io/docs/api-reference/speech-t2a-http

Example of a streaming Text-to-Speech API request.

```json
{
 "model": "speech-2.6-hd",
 "text": "Omg, the real danger is not that computers start thinking like people, but that people start thinking like computers. Computers can only help us with simple tasks.",
 "stream": true,
 "language_boost": "auto",
 "output_format": "hex",
 "voice_setting": {
 "voice_id": "English_expressive_narrator",
 "speed": 1,
 "vol": 1,
 "pitch": 0
 },
 "pronunciation_dict": {
 "tone": [
 "Omg/Oh my god"
 ]
 },
 "audio_setting": {
 "sample_rate": 32000,
 "bitrate": 128000,
 "format": "mp3",
 "channel": 1
 },
 "voice_modify": {
 "pitch": 0,
 "intensity": 0,
 "timbre": 0,
 "sound_effects": "spacious_echo"
 }
}
```

---

### Voice Settings API

Source: https://platform.minimax.io/docs/api-reference/speech-t2a-http

Configuration for voice synthesis settings.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| voice_id | string | Yes | The ID of the target voice (system, cloned, or AI-generated) |
| speed | number | No | Speech speed (default: 1.0) |

### Example

```json
{
 "text": "Sample text for synthesis.",
 "voice_setting": {
 "voice_id": "English_Persuasive_Man",
 "speed": 1.1
 }
}
```

---

### Voice Modification Settings

Source: https://platform.minimax.io/docs/api-reference/speech-t2a-http

Configure voice effects such as pitch, intensity, timbre, and sound effects.

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| pitch | integer | [-100, 100] | Deepen/Brighten voice |
| intensity | integer | [-100, 100] | Stronger/Softer |
| timbre | integer | [-100, 100] | Nasal/Crisp |
| sound_effects | string | See options | Sound effect to apply |

**Sound Effect Options:** `spacious_echo`, `auditorium_echo`, `lofi_telephone`, `robotic`

```json
{
 "pitch": 50,
 "intensity": -20,
 "timbre": 10,
 "sound_effects": "spacious_echo"
}
```

---

### Get Available Voices

Source: https://platform.minimax.io/docs/api-reference/voice-management-get

Retrieves a list of available voices based on the specified voice type.

### Request

```json
{
 "voice_type": "all"
}
```

### Response

```json
{
 "system_voice": [
 {
 "voice_id": "Chinese (Mandarin)_Reliable_Executive",
 "voice_name": "Steady Executive",
 "description": [
 "A steady and reliable male executive voice in standard Mandarin, conveying a trustworthy impression."
 ]
 }
 ],
 "voice_cloning": [],
 "voice_generation": [],
 "base_resp": {
 "status_code": 0,
 "status_msg": "success"
 }
}
```

---

## 9. Voice Cloning

### Voice Cloning API

Source: https://platform.minimax.io/docs/api-reference/voice-cloning-intro

The Voice Cloning API allows rapid cloning of a target voice timbre from provided audio. Cloned voices are temporary and will be deleted after 168 hours unless a synthesis operation is performed with them.

### Supported Models

| Model | Description |
|-------|-------------|
| speech-2.6-hd | Latest HD model with real-time response, intelligent parsing, fluent LoRA voice |
| speech-2.6-turbo | Latest Turbo model. Ultimate Value, 40 Languages |
| speech-02-hd | Superior rhythm and stability, with outstanding performance |
| speech-02-turbo | Superior rhythm and stability, with enhanced multilingual capabilities |
| speech-01-hd | Rich Voices, Expressive Emotions, Authentic Languages |
| speech-01-turbo | Excellent performance and low latency |

### Notes

- Cloning a voice does not immediately incur a fee. The fee is charged the first time a cloned voice is used in a T2A synthesis API call.
- Cloned voices are temporary. Use any T2A speech synthesis API with that voice within 168 hours (7 days) to make it permanent.

---

### POST /v1/voice_clone

Source: https://platform.minimax.io/docs/api-reference/voice-cloning-clone

Clones a voice from a given audio file.

### Request Example

```json
{
 "file_id": 123456789,
 "voice_id": "MyCustomVoice001",
 "text": "This is a test audio preview.",
 "model": "speech-2.6-hd",
 "language_boost": "English"
}
```

### Response Example

```json
{
 "audio_url": "https://cdn.minimax.io/audio/preview.mp3",
 "voice_id": "MyCustomVoice001"
}
```

---

## 10. Music Generation

### POST /v1/music_generation

Source: https://platform.minimax.io/docs/api-reference/music-generation

Generates music based on provided parameters.

### Request Example

```json
{
 "model": "music-2.0",
 "prompt": "Indie folk, melancholic, introspective, longing, solitary walk, coffee shop",
 "lyrics": "[verse]\nStreetlights flicker, the night breeze sighs\nShadows stretch as I walk alone\nAn old coat wraps my silent sorrow\nWandering, longing, where should I go\n[chorus]\nPushing the wooden door, the aroma spreads\nIn a familiar corner, a stranger gazes",
 "audio_setting": {
 "sample_rate": 44100,
 "bitrate": 256000,
 "format": "mp3"
 }
}
```

### Response Example

```json
{
 "data": {
 "task_id": "some_task_id",
 "audio_url": "https://api.minimax.io/v1/audio/example.mp3",
 "hex": "0x..."
 }
}
```

---

## 11. File Management

### GET /v1/files/list

Source: https://platform.minimax.io/docs/api-reference/file-management-list

Lists files on the MiniMax API Platform, categorized by their purpose.

**Query Parameters:**
- `purpose` (required): `voice_clone`, `prompt_audio`, or `t2a_async_input`

### Response Example

```json
{
 "files": [
 {
 "file_id": "${file_id}",
 "bytes": 5896337,
 "created_at": 1699964873,
 "filename": "297990555456011.tar",
 "purpose": "t2a_async_input"
 }
 ],
 "base_resp": {
 "status_code": 0,
 "status_msg": "success"
 }
}
```

---

### GET /v1/files/retrieve

Source: https://platform.minimax.io/docs/api-reference/file-management-retrieve

Retrieves details and download URL for a generated file.

**Query Parameters:**
- `file_id` (required): The unique identifier for the file

```bash
curl -X GET "https://api.minimax.io/v1/files/retrieve?file_id=12345" \
 -H "Authorization: Bearer YOUR_API_KEY"
```

### Response Example

```json
{
 "file": {
 "file_id": 12345,
 "bytes": 5896337,
 "created_at": 1700469398,
 "filename": "output_aigc.mp4",
 "purpose": "video_generation",
 "download_url": "www.downloadurl.com"
 },
 "base_resp": {
 "status_code": 0,
 "status_msg": "success"
 }
}
```

---

### POST /v1/files/upload

Source: https://platform.minimax.io/docs/api-reference/file-management-upload

Uploads a file to the Minimax platform.

**Purpose Values:** `voice_clone`, `prompt_audio`, `t2a_async_input`

### Response Example

```json
{
 "file": {
 "file_id": "${file_id}",
 "bytes": 5896337,
 "created_at": 1700469398,
 "filename": "MiniMax Open Platform-Test bot.docx",
 "purpose": "t2a_async_input"
 },
 "base_resp": {
 "status_code": 0,
 "status_msg": "success"
 }
}
```

---

## 12. Error Codes

Source: https://platform.minimax.io/docs/api-reference/errorcode

Common error codes and their meanings.

| Status Code | Meaning |
|-------------|---------|
| 0 | Request successful |
| 1000 | Unknown error |
| 1001 | Timeout |
| 1002 | RPM limit triggered |
| 1004 | Authentication failed |
| 1008 | Insufficient balance |
| 1013 | Internal service error |
| 1026 | Input content error |
| 1027 | Output content error |
| 1039 | TPM limit triggered |
| 2013 | Abnormal input format |
| 2049 | Invalid API key |

---

## Additional Resources

- [MiniMax Platform Documentation](https://platform.minimax.io/docs/api-reference/text-anthropic-api)
- [MiniMax MCP User Guide](https://platform.minimax.io/guides/mcp-guide)
- [Function Calling Guide](https://platform.minimax.io/guides/text-m2-function-call)
- [Video Agent Templates](https://platform.minimax.io/docs/faq/video-agent-templates)
- [Error Code Reference](https://platform.minimax.io/document/error_code)
