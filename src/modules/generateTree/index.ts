const generateTree = (data, keysDepth) => {
    const buildTreeRecursive = (tree, levels, data) => {
        if (!data) {
            return;  // Arrêtez la fonction si les données sont undefined
        }

        const [currentLevel, ...remainingLevels] = levels;
        const value = (data[currentLevel] || '').trim();  // Assurez-vous que la propriété existe avant d'appeler trim()

        if (value !== '') {
            if (!tree[value]) {
                tree[value] = {};
            }

            if (remainingLevels.length === 0) {
                // Si c'est le niveau le plus profond, stockez le contenu des autres colonnes
                tree[value] = { ...data };
            } else {
                buildTreeRecursive(tree[value], remainingLevels, data);
            }
        }
    };

    // Initialiser la structure de l'arbre
    const tree = {};

    // Itérer sur chaque ligne du tableau JSON
    data.forEach(dataItem => {
        buildTreeRecursive(tree, keysDepth, dataItem);
    });

    return tree;
};

export default generateTree;