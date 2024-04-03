%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Nativo = require('./expresiones/Nativo')
const Aritmeticas = require('./expresiones/Aritmeticas')
const Relacionales = require('./expresiones/Relacionales')

const Print = require('./instrucciones/Print')
%}

// analizador lexico

%lex
%options case-insensitive

COMMENTUL   "//"([^\r\n]*)?                          
COMMENTML   [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]
LETRA       [a-zA-ZÑñ] 
NUMID       [0-9]+  

%%

//palabras reservadas
"int"                   return "TKINT";
"double"                return "TKDOUBLE";
"bool"                  return "TKBOOL";
"char"                  return "TKCHAR";
"std::string"           return "TKSTRING";
"true"                  return "TKTRUE";
"false"                 return "TKFALSE";
"pow"                   return "TKPOW";
"imprimir"              return "TKIMPRIMIR"
"if"                    return "TKIF"

// simbolos del sistema
"{"                     return "LLAVEI";
"}"                     return "LLAVED";
";"                     return "PUNTOCOMA"
","                     return "COMA"
"+"                     return "MAS"
"-"                     return "MENOS"
"*"                     return "MULT";
"/"                     return "DIV";
"%"                     return "MOD";
"("                     return "PARI"
")"                     return "PARD"
"="                     return "IGUAL"
"<"                     return "MENORQ"
">"                     return "MAYORQ"
"<="                    return "MENORIQ"
">="                    return "MAYORIQ"
"=="                    return "DOBIGUAL"
"!="                    return "NOTIGUAL"
[0-9]+"."[0-9]+         return "DECIMAL"
[0-9]+                  return "ENTERO"
{LETRA}({LETRA}|{NUMID}|"_")*  return "ID"
[\"]((\\\")|[^\"\n])*[\"]   {yytext=yytext.substring(1,yyleng-1); return "CADENA";}
[\']((\\\')|[^\'\n])*[\']   {yytext=yytext.substring(1,yyleng-1); return "CARACTER";}

//comentarios
{COMMENTUL}      {}
{COMMENTML}      {}     

//blancos
[\ \r\t\f\t]+           {}
[\ \n]                  {}

// simbolo de fin de cadena
<<EOF>>                 return "EOF"


%{
    // CODIGO JS SI FUESE NECESARIO
%}

/lex

//precedencias
%left 'DOBIGUAL' 'NOTIGUAL'
%left 'MENORQ' 'MENORIQ' 'MAYORQ' 'MAYORIQ'
%left 'MAS' 'MENOS'
%left "MULT" "DIV" "MOD"
%right 'UMENOS'

// simbolo inicial
%start INICIO

%%

INICIO : INSTRUCCIONES EOF                  {return $1;}
;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION   {$1.push($2); $$=$1;}
              | INSTRUCCION                 {$$=[$1];}
;

// EXPRESION PUNTOCOMA            {$$=$1;}
INSTRUCCION : DECVARIABLE PUNTOCOMA            {$$=$1;}
            | IMPRESION PUNTOCOMA              {$$=$1;}
            | SENTIF                           {$$=$1;}
;

//console.log("Variable declarada "+ $1 +" ID "+ $2 +" exp "+$4.interpretar());
DECVARIABLE : TIPODATO ID IGUAL EXPRESION          {$$=$4;}
            | TIPODATO ID
;

IMPRESION : TKIMPRIMIR PARI EXPRESION PARD          {$$ = new Print.default($3, @1.first_line, @1.first_column);}
;

TIPODATO : TKINT                                      {$$ = Tipo.ENTERO ; $$ = $1 ;}
          | TKDOUBLE                                  {$$ = Tipo.DECIMAL ; $$ = $1 ;}
          | TKBOOL                                    {$$ = Tipo.BOOL ; $$ = $1 ;}
          | TKCHAR                                    {$$ = Tipo.CARACTER ; $$ = $1 ;}
          | TKSTRING                                  {$$ = Tipo.CADENA ; $$ = $1 ;}
;

EXPRESION : ARITMETICAS                               {$$ = $1;}
          | RELACIONAL                                {$$ = $1;}
          | PARI EXPRESION PARD                       {$$ = $2;}
          | ENTERO                                    {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO), $1, @1.first_line, @1.first_column );}
          | DECIMAL                                   {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL), $1, @1.first_line, @1.first_column );}
          | CADENA                                    {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CADENA), $1, @1.first_line, @1.first_column );}
          | CARACTER                                  {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CARACTER), $1, @1.first_line, @1.first_column );}
          | TKTRUE                                    {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), $1, @1.first_line, @1.first_column );}
          | TKFALSE                                   {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), $1, @1.first_line, @1.first_column );}
;

ARITMETICAS : EXPRESION MAS EXPRESION                   {$$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MENOS EXPRESION                 {$$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MULT EXPRESION                  {$$ = new Aritmeticas.default(Aritmeticas.Operadores.MULTIPLICACION, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION DIV EXPRESION                   {$$ = new Aritmeticas.default(Aritmeticas.Operadores.DIVISION, @1.first_line, @1.first_column, $1, $3);}
            | EXPRESION MOD EXPRESION                   {$$ = new Aritmeticas.default(Aritmeticas.Operadores.MODULO, @1.first_line, @1.first_column, $1, $3);}
            | TKPOW PARI EXPRESION COMA EXPRESION PARD  {$$ = new Aritmeticas.default(Aritmeticas.Operadores.POTENCIA, @1.first_line, @1.first_column, $3, $5);}
            | MENOS EXPRESION %prec UMENOS              {$$ = new Aritmeticas.default(Aritmeticas.Operadores.NEG, @1.first_line, @1.first_column, $2);}
;

RELACIONAL : EXPRESION MENORQ EXPRESION                 {$$ = new Relacionales.default(Relacionales.Operadores.MENORQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION MAYORQ EXPRESION                 {$$ = new Relacionales.default(Relacionales.Operadores.MAYORQUE, @1.first_line, @1.first_column, $1, $3);console.log("Mayor")}
           | EXPRESION MENORIQ EXPRESION                {$$ = new Relacionales.default(Relacionales.Operadores.MENORIGUALQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION MAYORIQ EXPRESION                {$$ = new Relacionales.default(Relacionales.Operadores.MAYORIGUALQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION DOBIGUAL EXPRESION               {$$ = new Relacionales.default(Relacionales.Operadores.DOBLEIGUAL, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION NOTIGUAL EXPRESION               {$$ = new Relacionales.default(Relacionales.Operadores.NOIGUAL, @1.first_line, @1.first_column, $1, $3);}
;

SENTIF : TKIF PARI EXPRESION PARD LLAVEI INSTRUCCION LLAVED   {$$ = $3 ; $$ = $6}
;

/*
{$$ =  en jison es igual a Result = en cup}
{$4 esta accediendo a el numero 4 de la gramatica en cuestion TKREDONDEAR PARI EXPRESION PARD $4 es PARD}
*/