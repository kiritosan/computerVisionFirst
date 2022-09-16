import { getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, convolution, sobel, arrayDivide, expandToImageDataArray, normalization } from './src/util.js'

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

  const normalGradXArray = normalization(gradXArray)
  const normalGradYArray = normalization(gradYArray)
  const normalGradTotalArray = normalization(gradTotalArray)

  const gradImageXArray = expandToImageDataArray(normalGradXArray.map((v) => v * 255))
  const gradImageYArray = expandToImageDataArray(normalGradYArray.map((v) => v * 255))
  const gradImageTotalArray = expandToImageDataArray(normalGradTotalArray.map((v) => v * 255))

  drawImageFromArray(canvasEdgeX, gradImageXArray)
  drawImageFromArray(canvasEdgeY, gradImageYArray)
  drawImageFromArray(canvasEdgeTotal, gradImageTotalArray)
})
