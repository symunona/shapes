const v1 = [

1, 9, 13,

14, 15, 23,

18, 20, 16,

24, 25, 26,

33, 34, 35,

39, 41, 42,

43, 47, 51,

53, 54, 73,

69, 70, 67,

76, 77, 81
]

const v2 = [
2, 4, 11,
8, 7, 10
]


v1.map((index)=>{
    $('#image-gallery').append(
        $('<img>', { 
            title: index,
            src: `gallery/v1/${index}.png`
        }))
})

v2.map((index)=>{
    $('#image-gallery').append(
        $('<img>', { 
            title: index,
            src: `gallery/v2/${index}.png`
        }))
})





