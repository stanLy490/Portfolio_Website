#!/bin/bash

# Portfolio Website Asset Downloader
# Usage: bash download-assets.sh

BASE_URL="https://raw.githubusercontent.com/Shaobo-copilot/Image_Bed/main"
PUBLIC_DIR="public"

echo "Downloading assets to $PUBLIC_DIR..."

# Create directories
mkdir -p "$PUBLIC_DIR/svgs" "$PUBLIC_DIR/images" "$PUBLIC_DIR/videos" "$PUBLIC_DIR/music"

# Download SVGs
echo "Downloading SVGs..."
curl -L --connect-timeout 30 --max-time 120 -o "$PUBLIC_DIR/svgs/vitruvian_image1.svg" "$BASE_URL/vitruvian_image1.svg"
curl -L --connect-timeout 30 --max-time 120 -o "$PUBLIC_DIR/svgs/vitruvian_image2.svg" "$BASE_URL/vitruvian_image2.svg"
curl -L --connect-timeout 30 --max-time 120 -o "$PUBLIC_DIR/svgs/vitruvian_image3.svg" "$BASE_URL/vitruvian_image3.svg"
curl -L --connect-timeout 30 --max-time 120 -o "$PUBLIC_DIR/svgs/vitruvian_image4.svg" "$BASE_URL/vitruvian_image4.svg"

# Download Page 1 images
echo "Downloading Page 1 images..."
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page1_1.png" "$BASE_URL/2025%20%E6%AF%95%E4%B8%9A%E5%B1%95383-383@4x.png"
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page1_2.png" "$BASE_URL/2025%20%E6%AF%95%E4%B8%9A%E5%B1%95383-383%20%E5%89%AF%E6%9C%AC%207@4x.png"
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page1_3.png" "$BASE_URL/2025%20%E6%AF%95%E4%B8%9A%E5%B1%95900-383%20%E5%89%AF%E6%9C%AC%205@4x.png"
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page1_4.png" "$BASE_URL/2025%20%E6%AF%95%E4%B8%9A%E5%B1%95383-383%20%E5%89%AF%E6%9C%AC%204@4x.png"

# Download Page 2 images
echo "Downloading Page 2 images..."
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page2_1.jpg" "$BASE_URL/page2_1.jpg"
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page2_2.jpg" "$BASE_URL/page2_2.jpg"

# Download Page 3 images
echo "Downloading Page 3 images..."
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page3_2.png" "$BASE_URL/page3_2.png"
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page3_4.png" "$BASE_URL/page3_4.png"
curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/page3_5.jpg" "$BASE_URL/page3_5.jpg"

# Download Meteorite images
echo "Downloading Meteorite images..."
for i in $(seq 1 13); do
  curl -L --connect-timeout 30 --max-time 300 -o "$PUBLIC_DIR/images/surface_${i}.jpg" "$BASE_URL/surface_${i}.jpg"
done

# Download videos
echo "Downloading videos..."
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/videos/clip1.mp4" "$BASE_URL/clip_1_studio2.mp4"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/videos/clip2.mp4" "$BASE_URL/clip2_studio3.mp4"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/videos/clip3.mp4" "$BASE_URL/clip3.mp4"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/videos/clip4.mp4" "$BASE_URL/clip4.mp4"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/videos/clip5.mp4" "$BASE_URL/clip5.mp4"

# Download music
echo "Downloading music..."
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/music/main.mp3" "$BASE_URL/Main.mp3"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/music/second.mp3" "$BASE_URL/Second.mp3"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/music/music1.mp3" "$BASE_URL/%E9%9F%B3%E4%B9%901.mp3"
curl -L --connect-timeout 30 --max-time 600 -o "$PUBLIC_DIR/music/music2.mp3" "$BASE_URL/%E9%9F%B3%E4%B9%902.mp3"

echo "Download complete!"
echo "Files downloaded to: $PUBLIC_DIR/"
ls -la "$PUBLIC_DIR/"
