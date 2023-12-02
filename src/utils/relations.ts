export const relations = {
    'assunto': {
        'obra_assunto': ['id_assunto', 'num_objeto'],
    },
    'autor': {
        'criacao_obra': ['id_autor', 'num_objeto'],
    },
    'material': {
        'obra_material': ['id_material', 'num_objeto'],
    },
    'obra': {
        'criacao_obra': ['num_objeto', 'id_autor'],
        'obra_assunto': ['num_objeto', 'id_assunto'],
        'obra_material': ['num_objeto', 'id_material'],
    },
    'ocupacao': {
        'criacao_obra': ['id_ocupacao', 'num_objeto'],
    },
};
