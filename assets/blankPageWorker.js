
function isDominantColorBackground(imageData, startPixel, endPixel, threshold) {
  const data = imageData.data;
  const colorMap = new Map();

  for (let i = startPixel; i < endPixel; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      const a = data[i + 3];

      if(r >= 238) {
        r = 255;
      }
      if(g >= 238) {
        g = 255;
      }
      if(b >= 238) {
        b = 255;
      }
      // Only consider fully opaque pixels
      if (a === 255) {
          const colorKey = `${r},${g},${b}`;
          if (colorMap.has(colorKey)) {
              colorMap.set(colorKey, colorMap.get(colorKey) + 1);
          } else {
              colorMap.set(colorKey, 1);
          }
      }
  }

  let dominantColor = null;
  let dominantColorCount = 0;
  colorMap.forEach((count, colorKey) => {
      if (count > dominantColorCount) {
          dominantColor = colorKey;
          dominantColorCount = count;
      }
  });

  // const totalPixels = (data.length / 4);
  const totalPixels = (endPixel-startPixel)/4;
  const dominantColorProportion = dominantColorCount / totalPixels;
  let isBackgroundDominant = dominantColorProportion > threshold;
  return {isBackgroundDominant, dominantColorProportion, dominantColor};
}

function detectBlankPages(imageData, startPixel, endPixel){
  let detected;
  detected = isDominantColorBackground(imageData, startPixel, endPixel, 0.90);
  return detected;
}

  function applySobel(imageData, outputData, Gx, Gy) {
    let width = imageData.width;
    let height = imageData.height;

    // Loop through each pixel (ignoring the border pixels)
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sumX = 0;
            let sumY = 0;

            // Apply Sobel kernel to the current pixel
            for (let ky = 0; ky < 3; ky++) {
                for (let kx = 0; kx < 3; kx++) {
                    let px = (x + kx - 1);
                    let py = (y + ky - 1);
                    let pixelIndex = (py * width + px) * 4;
                    let r = imageData.data[pixelIndex]; // Red
                    let g = imageData.data[pixelIndex + 1]; // Green
                    let b = imageData.data[pixelIndex + 2]; // Blue
                    let intensity = (r + g + b) / 3; // Convert to grayscale

                    sumX += Gx[ky][kx] * intensity;
                    sumY += Gy[ky][kx] * intensity;
                }
            }

            // Calculate the magnitude of the gradient
            let magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
            magnitude = Math.min(255, magnitude); // Clamp the value to max 255

            // Set the output pixel
            let outputIndex = (y * width + x) * 4;
            outputData[outputIndex] = magnitude;        // Red
            outputData[outputIndex + 1] = magnitude;    // Green
            outputData[outputIndex + 2] = magnitude;    // Blue
            outputData[outputIndex + 3] = 255;          // Alpha (opaque)
        }
    }

    return outputData;
  }

  addEventListener('message', ({ data }) => {
    const imageData = data.imageData;
    const response = {isBlank: detectBlankImage(imageData, data.pageNo, data.outputData), pageNo: data.pageNo};
    postMessage(response);
  });

function detectBlankImage(imageData, pageNo, outputData) {
  let detected;
  divideintoparts(imageData, pageNo, function(pgNo, isDominant, dominantColor, proportion) {
    // sachin for Generic_eVewer7_5207 : Blank Page detection : S2-P2
    if (isDominant & proportion > .90) {
      let Gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ];
  
      let Gy = [
          [-1, -2, -1],
          [ 0,  0,  0],
          [ 1,  2,  1]
      ];
      applySobel(imageData, outputData, Gx, Gy);
      let edgePixels = 0;
      for (let i = 0; i < outputData.length; i += 4) {
          if (outputData[i] > 0) { // Check if the pixel is an edge
              edgePixels++;
          }
      }
      if (edgePixels / (imageData.width * imageData.height) < 0.005) {
          // console.log("Page: " + pgNo + `The image is considered blank because the most dominant color (${dominantColor}) occupies ${proportion * 100}% of the image.`);
          detected = true;
      } else {
          detected = false;
      }
    } else {
      // console.log("Page: " + pgNo + "The image is not considered blank.");
      detected = false;
    }
  },);
  return detected;
}

function divideintoparts(imageData, pageNo, callback) {
  let divideImageInto = 64;
  nextTileCount = 1;
  previousTileCount = 1;
  let blankResult;
  // nextTileCount = 1;
  while(nextTileCount <= divideImageInto) {
    let startPixel = 0;
    let endPixel = Math.floor(imageData.data.length/64*previousTileCount);
    if(nextTileCount != 1) {
      startPixel = endPixel;
      endPixel = Math.floor(imageData.data.length/64*nextTileCount);
      previousTileCount++;
    }
    blankResult = detectBlankPages(imageData, startPixel, endPixel);
    if(!blankResult.isBackgroundDominant) {
      break;
    }
    nextTileCount++;
  }
  callback(pageNo, blankResult.isBackgroundDominant, blankResult.dominantColor, blankResult.dominantColorProportion);
}