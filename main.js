import { getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, convolution, sobel, arrayDivide, changeToImageDataArray } from './src/util.js'

const canvas = document.getElementById('myCanvas') // canvas画布
const canvasGray = document.getElementById('myCanvasGray') // canvas画布
const canvasEdgeX = document.getElementById('myCanvasEdgeX') // canvas画布
const canvasEdgeY = document.getElementById('myCanvasEdgeY') // canvas画布
const canvasEdgeTotal = document.getElementById('myCanvasEdgeTotal') // canvas画布

getImageData(canvas, './img/test.jpg').then((data) => {
  console.log('ImageDataArray:', data) // 打印输出像素数据
  /* pixelTraversal(data); */
  /* matrixTraversal(data) */
  const imgGrayDataArray = grayScale(data)
  drawImageFromArray(canvasGray, imgGrayDataArray)
  /* const kernel = [-1, 0, -1, -2, 0, +2, -1, 0, +1] */
  /* convolution(imgGrayDataArray, 1, 2, kernel) */
  const { gradXArray, gradYArray, gradTotalArray } = sobel(imgGrayDataArray, canvasGray.width, canvasGray.height)
  /* const res = arrayDivide([2, 3, 4], [1, 1, 1]) */
  const gradImageXArray = changeToImageDataArray(gradXArray)
  const gradImageYArray = changeToImageDataArray(gradYArray)
  const gradImageTotalArray = changeToImageDataArray(gradTotalArray)
  drawImageFromArray(canvasEdgeX, gradImageXArray)
  drawImageFromArray(canvasEdgeY, gradImageXArray)
  drawImageFromArray(canvasEdgeTotal, gradImageXArray)
})
