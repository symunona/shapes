const treeList = [
    'araucaria_0_younger_01',
    'araucaria_0_younger_02',
    'araucaria_0_younger_03',
    'araucaria_0_younger_04',
    'araucaria_1_young_01',
    'araucaria_1_young_02',
    'araucaria_1_young_03',
    'araucaria_1_young_04',
    'araucaria_2_intermediate_01',
    'araucaria_2_intermediate_02',
    'araucaria_2_intermediate_03',
    'araucaria_2_intermediate_04',
    'araucaria_2_intermediate_05',
    'araucaria_2_intermediate_06',
    'araucaria_3_old_02',
    'araucaria_3_old_01',
    'araucaria_3_old_03',
    'araucaria_3_old_04',
    'araucaria_3_old_05',
    'araucaria_3_old_06',
    'araucaria_4_older_01',
    'araucaria_4_older_02',
    'araucaria_4_older_03',
    'araucaria_4_older_04',
    'nothofagus_0_young_01',
    'nothofagus_0_young_02',
    'nothofagus_0_young_03',
    'nothofagus_0_young_04',
    'nothofagus_1_intermediate_01',
    'nothofagus_1_intermediate_02',
    'nothofagus_1_intermediate_03',
    'nothofagus_1_intermediate_04',
    'nothofagus_2_old_01',
    'nothofagus_2_old_02',
    'nothofagus_2_old_03',
    'nothofagus_2_old_04'
]

let treeMap = {
    araucaria: extract('araucaria'),
    nothofagus: extract('nothofagus')
};
let treeToUse = {}

let o = {
    // This many layers are being generated,
    // each layer is a little more faded.
    layerCount: 8,

    // Each layer has this many trees.
    treeCountPerLayer: 10,

    // These trees would all occupy the same place, so we
    // add a random to calculating that within their slot,
    // how much they can differ from the center position.
    slotNoise: 8,

    // The two genuses contain an array from youngest to oldest,
    // setting each stage's likelyhood to be selected.
    distribution: {
        araucaria: [5, 4, 3, 2, 1],
        nothofagus: [3, 2, 1]
    },
    specieDistribution: 0.5,

    // One can switch the trees on and off.
    treeSets: {},

    // The base from which the random is originated
    seed: 0,

    name: 'forest zero'
}

const settings = ['name', 'seed', 'layerCount', 'treeCountPerLayer', 'slotNoise', 'specieDistribution']

function resetGen () {
    o.seed = 0
    $('#seed').val(0)
    Math.seedrandom(o.seed)
    gen();
}

let all = 0, layerIndex = 0, species = Object.keys(treeMap)

loadSavedList()

generateSettings()

resetGen()


/**
 * Generate the current setting!
 */
function gen () {
    // Clean the forest.
    $('#forest').text('')

    // Show random generation.
    $('#cnt').text(o.seed)

    var stats = {all: 0, perSpecie: {}}
    Object.keys(treeMap).map((specie)=>stats.perSpecie[specie] = 0)

    parseInputs()

    // Generate layer by layer
    for (let l = 0; l < o.layerCount; l++) {
        let layerNode = $('<div>', {class: 'layer'})
        let layer = generateForestLayer(o, stats, genColor(l, o.layerCount))
        layerNode.append(layer)
        $('#forest').append(layerNode)
    }
    $('#stats pre').text(JSON.stringify(stats, null, 2))
    $('#seed').val(++o.seed)
}

/**
 *
 * @param {*} o
 * @param {*} stats
 * @param {*} color
 * @returns {Array} of nodes
 */
function generateForestLayer (o, stats, color) {
    let layer = []

    for (let t = 0; t < o.treeCountPerLayer; t++) {
        let slotNormal = 1 / o.treeCountPerLayer;
        let left = `calc( 10% + ${(slotNormal * t * 90) + ((Math.random() - 0.5) * o.slotNoise)}% - 100px )`
        let specie = (Math.random() > o.specieDistribution) ? 'araucaria' : 'nothofagus'
        let stage = distRandom(o, specie)
        // Add to stats:
        stats[specie] = stats[specie] || {}
        stats[specie][stage] = stats[specie][stage] || 0
        stats[specie][stage]++
        stats.all++
        stats.perSpecie[specie]++
        let img = makeTree(
            specie,
            stage,
            color,
            left
        )
        layer.push(img)
    }
    return layer
}

/**
 *
 * @param {String} specie  - of the
 * @param {String} stage - of the tree
 * @param {String} color - hexa, rgb
 * @param {String} left - pixel, percentage
 * @param {Number} [specificTree] - if provided, it will render the specific version of a tree,
 *                                  if not, then it will skip it.
 * @returns {Node} that contains a tree with a wrapper
 */
function makeTree (specie, stage, color, left, specificTree) {
    let trees = treeMap[specie][stage]
    let picked = specificTree !== undefined ? specificTree : (treeToUse[specie][stage]++ % trees.length)
    let treeStyle = `
        background-color: ${color};
        -webkit-mask-image: url("trees/${trees[picked]}.svg");
    `
    return $('<div>', {style: `left: ${left}`, class: 'tree'}).append($('<div>', {class: 'bg', style: treeStyle}))
}

/**
 * ---------------------------------------------------------<Utils
 */

/**
 * Creates the line of trees by stages.
 */
function generateSettings () {
// Let's count all the possible species and stages together
    all = 0
    layerIndex = 0
    for (let g = 0; g < species.length; g++) { all += Object.keys(treeMap[species[g]]).length }

    $('#distribution').html('')
    // Show the distribution table.
    for (let g = 0; g < species.length; g++) {
        let specie = species[g]
        treeToUse[specie] = {}
        for (let stage = 0; stage < Object.keys(treeMap[specie]).length; stage++) {
            treeToUse[specie][stage] = 0
            let treeWrapper = $('<div>', {class: 'tree-wrapper', style: `left: ${layerIndex++ * 90 / all}%`})
            let tree = makeTree(specie, stage, 'black', 0, 0);
            let input = $('<input>', {
                class: 'likely',
                type: 'number',
                id: 'dist-' + specie + '-' + stage,
                value: o.distribution[specie][stage]})

            treeWrapper.append(tree)
            treeWrapper.append(input)

            // Tree version selector
            const selector = $('<div>', {class: 'type-selector'})

            treeMap[specie][stage].map((piece, i)=>{
                let tree = makeTree(specie, stage, 'black', 0, i);
                // Toggle this tree
                // tree.on('click', ()=>{
                // })
                selector.append(tree)
            })
            treeWrapper.append(selector)

            $('#distribution').append(treeWrapper)
        }
    }
    const settingsNode = $('#settings').html('');
    for (var i = 0; i < settings.length; i++) {
        const setting = settings[i]
        let settingNode = $('<li>')
        let inp = $('<input>', {id: setting, value: o[setting]})
        if (!isNaN(o[setting])) { inp.attr('type', 'number') }
        settingNode.append($('<label>').text(setting))
        settingNode.append(inp)
        settingsNode.append(settingNode)
    }
}

function save () {
    parseInputs()
    let storeAlready = localStorage.getItem('forest')
    if (!storeAlready) {
        storeAlready = {
            saved: []
        }
    } else {
        storeAlready = JSON.parse(storeAlready)
    }

    const savedAlready = storeAlready.saved.find((t)=>t.name === o.name)
    if (savedAlready) {
        const index = storeAlready.saved.indexOf(savedAlready)
        storeAlready.saved.splice(index, 1, o)
    } else {
        storeAlready.saved.push(o)
    }
    localStorage.setItem('forest', JSON.stringify(storeAlready))
    loadSavedList()
}

function loadSavedList () {
    let storeAlready = localStorage.getItem('forest')
    let container = $('#saved')
    container.text('')
    if (storeAlready) {
        storeAlready = JSON.parse(storeAlready)
        storeAlready.saved.map((storedForest)=>{
            const element = $('<li>')
            const link = $('<a>').html(storedForest.name)
            link.on('click', ()=>{ loadStoredForest(storedForest) })
            const deleteLink = $('<a>', {title: 'delete'}).html('x')
            deleteLink.on('click', deleteSaved.bind(this, storedForest.name))
            element.append(link);
            element.append('&nbsp;');
            element.append(deleteLink);
            container.append(element)
        })
    }
}

function deleteSaved (name) {
    let storeAlready = JSON.parse(localStorage.getItem('forest'))
    var toDelete = storeAlready.saved.find((t)=>t.name === name)
    if (confirm(`sure delete ${name}?`)) {
        storeAlready.saved.splice(storeAlready.saved.indexOf(toDelete), 1)
        localStorage.setItem('forest', JSON.stringify(storeAlready))
        loadSavedList()
    }
}

function loadStoredForest (storedForest) {
    o = storedForest
    generateSettings()
    gen()
}

/**
 * Reads the input values into o.
 */
function parseInputs () {
    // Distribution selects
    for (let g = 0; g < species.length; g++) {
        let specie = species[g]
        for (let stage = 0; stage < Object.keys(treeMap[specie]).length; stage++) {
            let id = '#dist-' + specie + '-' + stage
            o.distribution[specie][stage] = parseFloat($(id).val())
        }
    }

    // Other settings
    for (var i = 0; i < settings.length; i++) {
        const setting = settings[i]
        let val = $('#' + setting).val()
        if (!isNaN(o[setting])) { val = parseFloat(val) }
        o[setting] = val
    }
}

/**
 * Extract all the trees for specific stages into a map structured like:
 * {
 *   stage1: [ ... list of trees ... ],
 *   stage2: [ ... list of trees ... ],
 *   ...
 * }
 * @param {String} genus
 * @returns {Object}
 */
function extract (genus) {
    let ret = {}
    treeList.map((name)=>{
        if (name.split('_')[0] === genus) {
            let stage = name.split('_')[1]
            ret[stage] = ret[stage] || []
            ret[stage].push(name)
        }
    })
    return ret
}


/**
 * Starts from the lightest, goes all the way up to black.
 * @param {Number} level
 * @param {Number} levels
 * @returns {String} color
 */
function genColor (level, levels) {
    let b = 255 - ((level + 1) * 255 / levels)
    return `rgb(${b}, ${b}, ${b})`
}

/**
 * @param {Object} o ptions.distribution
 * @param {String} specie
 * @returns {Integer} the randomly selected stage,
 * minding the distribution provided for the given specie.
 */
function distRandom (o, specie) {
    let stages = Object.keys(o.distribution[specie])
    let sum = stages.reduce((p, c)=>p + o.distribution[specie][c], 0)
    let out = Math.random() * sum
    let i = 0, pt = o.distribution[specie][0]
    while (pt < out) { i++; pt += o.distribution[specie][i] }
    return i
}
