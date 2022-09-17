import { nms, getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, convolution, sobel, arrayDivide, expandToImageDataArray, normalization, gaussianFilter } from './src/util.js'

const canvas = document.getElementById('myCanvas') // canvas画布
const canvasGray = document.getElementById('myCanvasGray') // canvas画布
const canvasEdgeX = document.getElementById('myCanvasEdgeX') // canvas画布
const canvasEdgeY = document.getElementById('myCanvasEdgeY') // canvas画布
const canvasEdgeTotal = document.getElementById('myCanvasEdgeTotal') // canvas画布
const canvasGaussian = document.getElementById('myCanvasGaussian') // canvas画布
const canvasEdgeXS = document.getElementById('myCanvasEdgeXS') // canvas画布
const canvasEdgeYS = document.getElementById('myCanvasEdgeYS') // canvas画布
const canvasEdgeTotalS = document.getElementById('myCanvasEdgeTotalS') // canvas画布
const myCanvasNMS = document.getElementById('myCanvasNMS') // canvas画布
const myCanvasLast = document.getElementById('myCanvasLast') // canvas画布

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

  /* 归一化处理 */
  const normalGradXArray = normalization(gradXArray)
  const normalGradYArray = normalization(gradYArray)
  const normalGradTotalArray = normalization(gradTotalArray)

  const gradImageXArray = expandToImageDataArray(normalGradXArray.map((v) => v * 255))
  const gradImageYArray = expandToImageDataArray(normalGradYArray.map((v) => v * 255))
  const gradImageTotalArray = expandToImageDataArray(normalGradTotalArray.map((v) => v * 255))

  drawImageFromArray(canvasEdgeX, gradImageXArray)
  drawImageFromArray(canvasEdgeY, gradImageYArray)
  drawImageFromArray(canvasEdgeTotal, gradImageTotalArray)

  console.warn('----------------sobel over----------------')

  /* canny 2*/
  const imgGrayGaussianArray = gaussianFilter(imgGrayDataArray, 5, 1)
  const imgGrayGaussianDataArray = expandToImageDataArray(imgGrayGaussianArray)
  drawImageFromArray(canvasGaussian, imgGrayGaussianDataArray)

  /* canny 3 */
  const { gradXArray: gradXArrayS, gradYArray: gradYArrayS, thetaArray: thetaArrayS, gradTotalArray: gradTotalArrayS } = sobel(imgGrayGaussianDataArray, 296, 296)

  /* 归一化处理 */
  const normalGradXArrayS = normalization(gradXArrayS)
  const normalGradYArrayS = normalization(gradYArrayS)
  const normalGradTotalArrayS = normalization(gradTotalArrayS)

  const gradImageXArrayS = expandToImageDataArray(normalGradXArrayS.map((v) => v * 255))
  const gradImageYArrayS = expandToImageDataArray(normalGradYArrayS.map((v) => v * 255))
  const gradImageTotalArrayS = expandToImageDataArray(normalGradTotalArrayS.map((v) => v * 255))

  drawImageFromArray(canvasEdgeXS, gradImageXArrayS)
  drawImageFromArray(canvasEdgeYS, gradImageYArrayS)
  drawImageFromArray(canvasEdgeTotalS, gradImageTotalArrayS)

  /* canny 4:nms */
  /* const nmsArray = nms(gradTotalArrayS, gradXArrayS, gradYArrayS) */
  /* let arr = new Array(16).fill(0) */
  /* let arr1 = arr.map((v, i) => i) */
  /* let arr2 = arr1.map((v, i) => Math.random()) */
  /* let arr3 = arr.map((v, i) => Math.random()) */
  /* window.nms = nms */
  /* window.arr1 = arr1 */
  /* window.arr2 = arr2 */
  /* window.arr3 = arr3 */
  /* nms(arr1, arr2, arr3) */

  const gradNMSArray = nms(gradTotalArray, gradXArray, gradYArray)
})
