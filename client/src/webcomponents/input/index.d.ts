// declara como importar qualquer arquivo HTML
declare module '*.html' {
    // define que modulos HTML tem uma constante value do tipo String
    const value: string;
    // o valor padrão retornado por estes modulos é a value string definida na 
    // linha anterior
    export default value
}
