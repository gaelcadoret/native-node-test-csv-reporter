type neighbor = {
    'up'            ?: Cell
    'down'          ?: Cell
    'left'          ?: Cell
    'right'         ?: Cell
    'top-left'      ?: Cell
    'top-right'     ?: Cell
    'bottom-left'   ?: Cell
    'bottom-right'  ?: Cell
}
type Cell = {
    x                   : number
    y                   : number
    value               : string
    neighbors           ?: neighbor[]
    hasSymbolNeighbor   ?: boolean
    group               ?: string
    neighborIndexKey    ?: string
}
type Row = Cell[]
type Rows = Row[]