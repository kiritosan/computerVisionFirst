import { getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, convolution, sobel, fillImageArray, arrayDivide } from './src/util.js'

const canvas = document.getElementById('myCanvas') // canvas画布
const canvasGray = document.getElementById('myCanvasGray') // canvas画布
const canvasEdge = document.getElementById('myCanvasEdge') // canvas画布

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
  fillImageArray(gradTotalArray)
})
