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
10, 11, 14,
2, 7, 8,
18, 25, 26,
21, 29

]


v1.map((index)=>{
    let page = Math.floor(index / 9)
    $('#image-gallery').append(
        $('<a>', {href: `vol_01/#p=${page}&s=${index}`}).html(
            $('<img>', {
                title: index,
                src: `gallery/v1/${index}.png`
            }))
        )
})

v2.map((index)=>{
    $('#image-gallery').append(
        $('<a>', {href: `vol_02/#${index}s`}).html(
            $('<img>', {
                title: index,
                src: `gallery/v2/${index}.png`
            }))
        )
})





