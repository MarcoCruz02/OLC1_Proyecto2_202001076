%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Nativo = require('./expresiones/Nativo')
const Aritmeticas = require('./expresiones/Aritmeticas')
const Relacionales = require('./expresiones/Relacionales')
const AccesoVar = require('./expresiones/AccesoVar')

const Print = require('./instrucciones/Print')
const PrintLn = require('./instrucciones/PrintLn')
const Declaracion = require('./instrucciones/Declaracion')
const AsignacionVar = require('./instrucciones/AsignacionVar')
%}

// analizador lexico

%lex
%options case-insensitive

COMMENTUL   "//"([^\r\n]*)?                          
COMMENTML   [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]

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
"cout"                  return "TKCOUT"
"endl"                  return "TKENDL"
"if"                    return "TKIF"
"new"                   return "TKNEW"

// simbolos del sistema
"{"                     return "LLAVEI";
"}"                     return "LLAVED";
"["                     return "CORI";
"]"                     return "CORD";
";"                     return "PUNTOCOMA"
","                     return "COMA"
"+"                     return "MAS"
"-"                     return "MENOS"
"*"                     return "MULT";
"/"                     return "DIV";
"%"                     return "MOD";
"("                     return "PARI"
")"                     return "PARD"
"=="                    return "DOBIGUAL"
"<="                    return "MENORIQ"
">="                    return "MAYORIQ"
"!="                    return "NOTIGUAL"
"="                     return "IGUAL"
"<"                     return "MENORQ"
">"                     return "MAYORQ"
[0-9]+"."[0-9]+         return "DECIMAL"
[0-9]+                  return "ENTERO"
[a-zA-ZÑñ][a-zA-ZÑñ0-9_]*  return "ID"
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

INSTRUCCION : DECVARIABLE PUNTOCOMA            {$$=$1;}
            | IMPRESION PUNTOCOMA              {$$=$1;}
            | ASIGNACION PUNTOCOMA             {$$=$1;}
            | SENTIF                           {$$=$1;}
            | DECARRAY PUNTOCOMA               {$$=$1;}
;

//console.log("Variable declarada "+ $1 +" ID "+ $2 +" exp "+$4.interpretar());
//$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4);
DECVARIABLE : TIPODATO DECRECURSIVA IGUAL EXPRESION   {$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4);}
            | TIPODATO DECRECURSIVA                   {$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, null);}
;

DECRECURSIVA : DECRECURSIVA TIPODECLARACION   {$1.push($2); $$=$1;}
             | TIPODECLARACION                {$$=[$1];}
;            

TIPODECLARACION : COMA ID       {$$ = $2;}
                | ID            {$$ = $1;}
;

DECARRAY : TIPODATO ID CORI CORD IGUAL TKNEW TIPODATO CORI ENTERO CORD  {console.log("array 1 D reconnocido")}
;

ASIGNACION : ID IGUAL EXPRESION        {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
;

IMPRESION : TKCOUT MENORQ MENORQ EXPRESION                        {$$ = new Print.default($4, @1.first_line, @1.first_column);}
          | TKCOUT MENORQ MENORQ EXPRESION MENORQ MENORQ TKENDL   {$$ = new PrintLn.default($4, @1.first_line, @1.first_column);}
;

TIPODATO : TKINT                                      {$$ = new Tipo.default(Tipo.tipoDato.ENTERO);}
          | TKDOUBLE                                  {$$ = new Tipo.default(Tipo.tipoDato.DECIMAL) ;}
          | TKBOOL                                    {$$ = new Tipo.default(Tipo.tipoDato.BOOL) ;}
          | TKCHAR                                    {$$ = new Tipo.default(Tipo.tipoDato.CARACTER) ;}
          | TKSTRING                                  {$$ = new Tipo.default(Tipo.tipoDato.CADENA) ;}
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
          | ID                                        {$$ = new AccesoVar.default($1, @1.first_line, @1.first_column );}
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

SENTIF : TKIF PARI EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED   {$$ = $3 ;}
;

/*
{$$ =  en jison es igual a Result = en cup}
{$4 esta accediendo a el numero 4 de la gramatica en cuestion TKREDONDEAR PARI EXPRESION PARD $4 es PARD}
*/