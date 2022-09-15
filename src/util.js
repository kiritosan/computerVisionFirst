function getImageData(canvas, url) {
  const ctx = canvas.getContext('2d') // 设置在画布上绘图的环境
  const image = new Image()
  image.src = url
  //获取画布宽高
  const { width: w, height: h } = canvas
  return new Promise((resolve) => {
    image.onload = function () {
      ctx.drawImage(image, 0, 0, w, h) // 将图片绘制到画布上
      const imgData = ctx.getImageData(0, 0, w, h) // 获取画布上的图像像素
      resolve(imgData.data) // 获取到的数据为一维数组,包含图像的RGBA四个通道数据
      /* ctx.clearRect(0, 0, w, h); */
    }
  })
}

/* 向特定canvas元素输入图像 */
function drawImageFromArray(canvas, imgDataArray) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  const imgData = ctx.createImageData(w, h)
  for (let i = 0; i < imgDataArray.length; i += 4) {
    ;[imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]] = [imgDataArray[i], imgDataArray[i + 1], imgDataArray[i + 2], imgDataArray[i + 3]]
  }

  ctx.putImageData(imgData, 0, 0)
}

function pixelTraversal(imgDataArray) {
  for (let i = 0; i < imgDataArray.length; i += 4) {
    const [r, g, b, a] = [imgDataArray[i], imgDataArray[i + 1], imgDataArray[i + 2], imgDataArray[i + 3]]
    console.log(r, g, b, a)
  }
}

function matrixTraversal({ width, height }) {
  for (let row = 0; row < width; row++) {
    for (let col = 0; col < height; col++) {
      let index = (row * width + col) * 4
      const [r, g, b, a] = [data[index], data[index + 1], data[index + 2], data[index + 3]]
      console.log(r, g, b, a)
    }
  }
}

/* https://www.zhihu.com/question/22039410 */
/* https://en.wikipedia.org/wiki/Grayscale */
/*灰度算法: 0.299*r+0.587*g+0.114*b */
function grayScale(imgDataArray) {
  const imgArray = []
  for (let i = 0; i < imgDataArray.length; i += 4) {
    const [r, g, b] = [imgDataArray[i], imgDataArray[i + 1], imgDataArray[i + 2]]
    const y = 0.299 * r + 0.587 * g + 0.114 * b
    imgArray.push(y)
  }
  console.log('ImageGrayArray:', imgArray)
  return imgArray
}

/* 需要归一化后再乘255 */
function normalization(array) {
  const max = Math.max.apply(null, array)
  const min = Math.min.apply(null, array)
  return array.map((v) => Math.round((v - min) / (max - min)))
}
/* 返回 */
function sobel(imgGrayDataArray, imgWidth, imgHeight) {
  const kernelX = [-1, 0, -1, -2, 0, +2, -1, 0, +1]
  const kernelY = [1, 2, 1, 0, 0, 0, -1, -2, -1]
  /*最边上一圈像素不卷积*/
  const gradXArray = []
  const gradYArray = []
  const gradTotalArray = []
  const thetaArray = []
  for (let i = 1; i < imgWidth - 1; i++) {
    for (let j = 1; j < imgHeight - 1; j++) {
      const gradX = convolution(imgGrayDataArray, i, j, kernelX)
      const gradY = convolution(imgGrayDataArray, i, j, kernelY)
      const gradTotal = Math.abs(gradX) + Math.abs(gradY)
      const theta = Math.atan(gradY / gradX)
      gradXArray.push(gradX)
      gradYArray.push(gradY)
      gradTotalArray.push(gradTotal)
      thetaArray.push(theta)
    }
  }
  console.log('gradXArray', gradXArray)
  console.log('gradYArray', gradYArray)
  console.log('gradTotalArray', gradTotalArray)
  return { gradXArray, gradYArray, gradTotalArray, thetaArray }
}

function convolution(imgGrayDataArray, pixelPosX, pixelPosY, kernel) {
  const fieldX = [pixelPosX - 1, pixelPosX, pixelPosX + 1]
  const fieldY = [pixelPosY - 1, pixelPosY, pixelPosY + 1]
  const width = Math.sqrt(imgGrayDataArray.length / 4)
  let i = 0
  let res = 0
  for (const row of fieldY) {
    for (const col of fieldX) {
      res += imgGrayDataArray[(row * width + col) * 4] * kernel[i] /*rgba的r, 由于被灰度处理过 所以rgb数值一致*/
      i += 1
    }
  }
  /* console.log('convolution result:', res) */
  return res
}

/* https://www.cnblogs.com/hmy-665/p/11768138.html */
function transposition(arr) {
  return arr[0].map(function (col, i) {
    return arr.map(function (row) {
      return row[i]
    })
  })
}

/* 卷积后数组扩展成四值一组的imageArray */
function expandToImageDataArray(array) {
  const len = array.length
  const imgDataArray = new Uint8ClampedArray(len * 4)
  let gradArrayIndex = 0
  for (let i = 0; i < len * 4; i += 4) {
    imgDataArray[i] = array[gradArrayIndex]
    imgDataArray[i + 1] = array[gradArrayIndex]
    imgDataArray[i + 2] = array[gradArrayIndex]
    imgDataArray[i + 3] = 255
    gradArrayIndex += 1
  }
  console.log('imgDataArray', imgDataArray)
  return imgDataArray
}

function arrayDivide(arrayY, arrayX) {
  if (!arrayY.length || !arrayX.length) {
    console.error("array can't be empty")
    return []
  }
  if (arrayX.length !== arrayY.length) {
    console.error('the length of two array should be the same')
    return []
  }
  return arrayY.slice().map((v, i) => Math.round(v / arrayX[i]))
}

export { getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, transposition, convolution, sobel, expandToImageDataArray, arrayDivide, normalization }
