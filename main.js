import { getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, convolution, sobel, arrayDivide, expandToImageDataArray } from './src/util.js'

const canvas = document.getElementById('myCanvas') // canvas画布
const canvasGray = document.getElementById('myCanvasGray') // canvas画布
const canvasEdgeX = document.getElementById('myCanvasEdgeX') // canvas画布
const canvasEdgeY = document.getElementById('myCanvasEdgeY') // canvas画布
const canvasEdgeTotal = document.getElementById('myCanvasEdgeTotal') // canvas画布

getImageData(canvas, './img/test.jpg').then((data) => {
  console.log('ImageDataArray:', data) // 打印输出像素数据
  /* pixelTraversal(data); */
  /* matrixTraversal(data) */
  const imgGrayArray = grayScale(data)
  const imgGrayDataArray = expandToImageDataArray(imgGrayArray)

  drawImageFromArray(canvasGray, imgGrayDataArray)
  /* const kernel = [-1, 0, -1, -2, 0, +2, -1, 0, +1] */
  /* convolution(imgGrayDataArray, 1, 2, kernel) */
  const { gradXArray, gradYArray, gradTotalArray, thetaArray } = sobel(imgGrayDataArray, canvasGray.width, canvasGray.height)
  const gradImageXArray = expandToImageDataArray(gradXArray)
  const gradImageYArray = expandToImageDataArray(gradYArray)
  const gradImageTotalArray = expandToImageDataArray(gradTotalArray)
  console.log('thetaArray', thetaArray)
  drawImageFromArray(canvasEdgeX, gradImageXArray)
  drawImageFromArray(canvasEdgeY, gradImageXArray)
  drawImageFromArray(canvasEdgeTotal, gradImageXArray)

  /* test convolution */
  const kernelY = [1, 2, 1, 0, 0, 0, -1, -2, -1]
  const gradY = convolution(imgGrayDataArray, 1, 1, kernelY)
  console.log('gradY', gradY)
})
