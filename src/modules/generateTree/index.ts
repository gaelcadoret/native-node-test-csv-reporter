const buildTreeRecursive = (tree, levels, data) => {
    if (!data) return tree;

    const [currentLevel, ...remainingLevels] = levels;
    const value = (data[currentLevel] || '').trim();

    if (value !== '') {
        const subtree = tree[value] || {};

        const updatedSubtree = remainingLevels.length === 0
            ? { ...data }
            : buildTreeRecursive(subtree, remainingLevels, data);

        return {
            ...tree,
            [value]: updatedSubtree,
        };
    }

    return tree;
};

const reducer = (keysDepth) => (accTree, dataItem) => buildTreeRecursive(accTree, keysDepth, dataItem)

const generateTree = (data, keysDepth) =>
    data.reduce(reducer(keysDepth), {});

export default generateTree;