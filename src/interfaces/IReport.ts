export interface IReport {
    primaryTable: ITable;
    linkedTables: ITable[];
};

interface ITable {
    name: ETableNames;
    fields: IField[];
    limit?: number;
}

interface IField {
    name: string;
    sort?: ESort;
    filter?: IFilter;
}

interface IFilter {
    type: EFilterType;
    value: string;
}

enum ETableNames {
    ASSUNTO = 'assunto',
    AUTOR = 'autor',
    MATERIAL = 'material',
    OBRA = 'obra',
    OCUPACAO = 'ocupacao',
}

enum ESort {
    ASC = 'ASC',
    DESC = 'DESC'
}

enum EFilterType {
    EQUALS = 'equals',
    NOT = 'not',
    LT = 'lt',
    LTE = 'lte',
    GT = 'gt',
    GTE = 'gte',
    IN = 'in',
    NOT_IN = 'notIn',
    CONTAINS = 'contains',
    STARTS_WITH = 'startsWith',
    ENDS_WITH = 'endsWith',
    AND = 'AND',
    OR = 'OR',
    NOT_ = 'NOT'
}