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
  console.log(`The picture has been rendered to canvas (canvas id: ${canvas.id})`)
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

/* TODO 为什么不直接算出width和height 因为图像不一定是方形的 目前大部分函数以方形计算 不灵活 */
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
      const gradX = Math.floor(convolution(imgGrayDataArray, i, j, kernelX) / 8) /* 得到正确的幅值需要除以8 */
      const gradY = Math.floor(convolution(imgGrayDataArray, i, j, kernelY) / 8) /* 得到正确的幅值需要除以8 */
      const gradTotal = Math.sqrt(Math.pow(gradX, 2) + Math.pow(gradY, 2))
      const theta = radianToAngle(Math.atan(gradY / gradX))
      gradXArray.push(gradX)
      gradYArray.push(gradY)
      gradTotalArray.push(gradTotal)
      thetaArray.push(theta)
    }
  }
  console.log('gradXArray', gradXArray)
  console.log('gradYArray', gradYArray)
  console.log('gradTotalArray', gradTotalArray)
  console.log('thetaArray', thetaArray)
  return { gradXArray, gradYArray, thetaArray, gradTotalArray }
}

/* 使用此函数卷积的时候需要从1开始最后一个也不能要 最外面一圈都要去掉 */
/* 只能卷积三个核的 */
/* const arr = new Array(5).fill(0) */
/* const arr = new Array(kernelLength).fill(0).map((v, i) => i - Math.floor(kernelLength / 2)) */
function convolution(imgGrayDataArray, pixelPosX, pixelPosY, kernel) {
  const kernelLength = Math.sqrt(kernel.length)
  /* 中心是零的数组 */
  const tmpArr = new Array(kernelLength).fill(0).map((v, i) => i - Math.floor(kernelLength / 2))
  const fieldX = tmpArr.map((v) => v + pixelPosX) /* 向下是x方向，向右是y方向 */
  const fieldY = tmpArr.map((v) => v + pixelPosY)
  const width = Math.sqrt(imgGrayDataArray.length / 4)
  let i = 0
  let res = 0
  for (const row of fieldX) {
    for (const col of fieldY) {
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
  console.log('imgDataArray expand success', imgDataArray)
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

/* https://zhuanlan.zhihu.com/p/445415462 用的二维高斯公式不是离散的，好像有问题*/
/* https://blog.csdn.net/qq_45717425/article/details/120640688 */
function gaussianFilter(imgDataArray, k, sigma) {
  const gauss_kernel = []
  const len = Math.sqrt(Math.floor(imgDataArray.length / 4))
  const imgArray = []
  const edgeBias = Math.floor(k / 2)
  const zeroCenteredArray = new Array(k).fill(0).map((v, i) => i - Math.floor(k / 2))

  /* 高斯核构造 */
  for (const i of zeroCenteredArray) {
    for (const j of zeroCenteredArray) {
      /* 二维高斯函数离散公式 */
      /* TODO i和j从几开始？ */
      gauss_kernel.push(Math.exp(-(Math.pow(i - k - 1, 2) + Math.pow(j - k - 1, 2)) / (2 * Math.pow(sigma, 2))) / (2 * Math.PI * Math.pow(sigma, 2)))
    }
  }

  /* 高斯核归一化 否则值会很小显示不出来 */
  const sum = gauss_kernel.reduce((pre, cur) => pre + cur)
  /* 修改元数组 */
  gauss_kernel.forEach((v, i, a) => {
    a[i] = v / sum
  })

  //根据卷积核的大小不同，边缘减少的大小也不同 k=5的时候，要从2开始
  for (let i = edgeBias; i < len - edgeBias; i++) {
    for (let j = edgeBias; j < len - edgeBias; j++) {
      imgArray.push(convolution(imgDataArray, i, j, gauss_kernel))
    }
  }

  console.log('ImageGaussianArray', imgArray)
  return imgArray
}

function radianToAngle(radian) {
  /*弧度 乘以 一弧度多少角度*/
  return Math.round(radian * (180 / Math.PI))
}

/* https://blog.csdn.net/weixin_39994296/article/details/110595624 */
function nms(gradTotalArray, gradXArray, gradYArray) {
  const len = gradTotalArray.length
  const w = Math.sqrt(len)
  const gradNMSArray = []
  /* 去掉外圈一层 */
  for (let r = 1; r < w - 1; r++) {
    for (let c = 1; c < w - 1; c++) {
      let index = r * w + c
      /* 向下是x方向，向右是y方向 */
      /* const fieldX = tmpArr.map((v) => v + r)  */
      /* const fieldY = tmpArr.map((v) => v + c) */

      /* 通过两个循环拿坐标 取外围点的梯度值 */
      /* 根据梯度方向正反取需要的点的梯度值加上权重得到插值点的权重 */
      /* for (const row of fieldX) { */
      /*   for (const col of fieldY) { */
      const gradX = gradXArray[index]
      const gradY = gradYArray[index]
      const gradTotal = gradTotalArray[index]
      /* 点确定 该点的权重就确定了 */
      /* y/x是斜率，对应斜率角 x/y则对应三角形的另一个角 将像素点间的距离当作1 那么亚像素点与相邻两点的距离就可以算出来（与基准十字上点的距离为x/y，与四角上点的距离为1-x/y）*/
      const weight = Math.abs(gradX) / Math.abs(gradY) /* TODO 注意 权重是x/y 梯度方向三角形的另一个角*/
      let grad1, grad2, grad3, grad4

      /* 根据梯度方向插值 */

      /* 规定向下为x方向 水平向右为y方向 */
      /* y大于x的情况 */
      /* 1. 找到插值点的邻接点 */
      if (Math.abs(gradY) > Math.abs(gradX)) {
        /* 十字线上两点确定 */
        grad2 = gradTotalArray[r * w + (c - 1)] /* 等同于gradTotalArray[r][c-1] */
        grad4 = gradTotalArray[r * w + (c + 1)]
        /*  gradx和grady同号 */
        if (gradXArray[r * w + c] * gradYArray[r * w + c] > 0) {
          grad1 = gradTotalArray[(r - 1) * w + (c - 1)]
          grad3 = gradTotalArray[(r + 1) * w + (c + 1)]
        } else {
          /*  gradx和grady异号 */
          grad1 = gradTotalArray[(r + 1) * w + (c - 1)]
          grad3 = gradTotalArray[(r - 1) * w + (c + 1)]
        }
      } else {
        grad2 = gradTotalArray[(r - 1) * w + c] /* 等同于gradTotalArray[r-1][c] */
        grad4 = gradTotalArray[(r + 1) * w + c]
        if (gradX * gradY > 0) {
          grad1 = gradTotalArray[(r - 1) * w + (c - 1)]
          grad3 = gradTotalArray[(r + 1) * w + (c + 1)]
        } else {
          grad1 = gradTotalArray[(r - 1) * w + (c + 1)]
          grad3 = gradTotalArray[(r + 1) * w + (c - 1)]
        }
      }
      /* 2. 邻接点权重通过加权得到插值点的权重 */
      /* 1和2要在同侧 3和4要在同侧 */
      const gradVirtual1 = weight * grad1 + (1 - weight) * grad2
      const gradVirtual2 = weight * grad3 + (1 - weight) * grad4

      /* 判断当前点梯度方向上的梯度与最近像素点的梯度比是否为极大值(局部最大值) */
      if (gradTotal >= gradVirtual1 && gradTotal >= gradVirtual2) {
        gradNMSArray.push(gradTotal)
      } else {
        /* 非极大值抑制 */
        gradNMSArray.push(0)
      }
    }
    /* } */
    /* } */
  }
  console.log('gradNMSArray', gradNMSArray)
  return gradNMSArray
}

export { nms, radianToAngle, gaussianFilter, getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, transposition, convolution, sobel, expandToImageDataArray, arrayDivide, normalization }
