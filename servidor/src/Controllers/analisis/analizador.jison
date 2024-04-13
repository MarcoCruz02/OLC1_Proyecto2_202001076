%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Nativo = require('./expresiones/Nativo')
const Aritmeticas = require('./expresiones/Aritmeticas')
const Relacionales = require('./expresiones/Relacionales')
const AccesoVar = require('./expresiones/AccesoVar')
const AccesoList = require('./expresiones/AccesoList')
const AccesoList2D = require('./expresiones/AccesoList2D')
const AccesoIncDec= require('./expresiones/AccesoIncDec')

const Print = require('./instrucciones/Print')
const PrintLn = require('./instrucciones/PrintLn')
const Declaracion = require('./instrucciones/Declaracion')
const AsignacionVar = require('./instrucciones/AsignacionVar')
const DeclaracionLista = require('./instrucciones/DeclaracionLista')
const DeclaracionLista2D = require('./instrucciones/DeclaracionLista2D')
const AsignacionList2D = require('./instrucciones/AsignacionList2D')
const If = require('./instrucciones/If')
const While = require('./instrucciones/While')
const Dowhile = require('./instrucciones/Dowhile')
const For = require('./instrucciones/For')
const Break = require('./instrucciones/Break')
const Switch = require('./instrucciones/Switch')
const Case = require('./instrucciones/Case')

%}

// analizador lexico

%lex
%options case-insensitive

COMMENTUL   "//"([^\r\n]*)?                          
COMMENTML   [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] 

%%
//comentarios ha ignorar
{COMMENTUL}             {}  
{COMMENTML}             {}  

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
"switch"                return "TKSWITCH"
"case"                  return "TKCASE"
"default"               return "TKDEFAULT"
"new"                   return "TKNEW"
"while"                 return "TKWHILE"
"break"                 return "TKBREAK"
"do"                    return "TKDO"
"for"                   return "TKFOR"
"else"                  return "TKELSE"

// simbolos del sistema
"{"                     return "LLAVEI";
"}"                     return "LLAVED";
"["                     return "CORI";
"]"                     return "CORD";
";"                     return "PUNTOCOMA"
","                     return "COMA"
"++"                    return "INCREMENTO"
"--"                    return "DECREMENTO"
"+"                     return "MAS"
"-"                     return "MENOS"
"*"                     return "MULT";
"/"                     return "DIV";
"%"                     return "MOD";
"("                     return "PARI"
")"                     return "PARD"
//los simbolos dobles <= se ponen antes que los libres < , = para que el reconocimiento no se quede en los libres solamente 
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
%left 'MENORQ' 'MENORIQ' 'MAYORQ' 'MAYORIQ' 'DOBIGUAL' 'NOTIGUAL'
%left 'MAS' 'MENOS'
%left 'MULT' 'DIV' 
%left 'MOD'
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
            | ASIGNLISTA2D PUNTOCOMA           {$$=$1;}
            | DECARRAY PUNTOCOMA               {$$=$1;}
            | SENTWHILE                        {$$=$1;}
            | SENTDOWHILE                      {$$=$1;}
            | SENTBREAK                        {$$=$1;}
            | SENTFOR                          {$$=$1;}
            //| SENTSWITCH                       {$$=$1; console.log("lo detecta");}
            | error                            {$$=$1; console.log("error1");}
; 


SENTSWITCH : TKSWITCH PARI EXPRESION PARD LLAVEI SENTCASE LLAVED  {$$ = new Switch.default($3, $6, @1.first_line, @1.first_column); console.log("ent switch")}
;

SENTCASE : TKCASE EXPRESION DOSPUNTOS INSTRUCCIONES           {$$ = new Case.default($2, $4, @1.first_line, @1.first_column);}
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

DECARRAY : TIPODATO ID CORI CORD IGUAL TKNEW TIPODATO CORI EXPRESION CORD  {$$ = new DeclaracionLista.default($1, @1.first_line, @1.first_column, $2, null, $9);}
         | TIPODATO ID CORI CORD IGUAL CORI ARRAYRECURSIVO CORD            {$$ = new DeclaracionLista.default($1, @1.first_line, @1.first_column, $2, $7, null);}
         | TIPODATO ID CORI CORD CORI CORD IGUAL TKNEW TIPODATO CORI EXPRESION CORD CORI EXPRESION CORD  {$$ = new DeclaracionLista2D.default($1, @1.first_line, @1.first_column, $2, null, $11, $14);}
;

ASIGNLISTA2D : ID CORI ENTERO CORD CORI ENTERO CORD IGUAL EXPRESION  {$$ = new AsignacionList2D.default($1, $9, @1.first_line, @1.first_column, $3, $6);}
;

ARRAYRECURSIVO : ARRAYRECURSIVO COMA EXPRESION   {$1.push($3); $$=$1;}
               | EXPRESION                       {$$=[$1];}
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
          | TKTRUE                                    {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), true, @1.first_line, @1.first_column );}
          | TKFALSE                                   {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), false, @1.first_line, @1.first_column );}
          | ID CORI ENTERO CORD CORI ENTERO CORD      {$$ = new AccesoList2D.default($1, @1.first_line, @1.first_column, $3, $6 );}
          | ID CORI ENTERO CORD                       {$$ = new AccesoList.default($1, @1.first_line, @1.first_column, $3 );}
          | ID INCREMENTO                             {$$ = new AccesoIncDec.default($1, "++", @1.first_line, @1.first_column );}
          | ID DECREMENTO                             {$$ = new AccesoIncDec.default($1, "--", @1.first_line, @1.first_column );}
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


RELACIONAL : EXPRESION MENORQ EXPRESION                 {$$ = new Relacionales.default(Relacionales.Relacional.MENORQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION MAYORQ EXPRESION                 {$$ = new Relacionales.default(Relacionales.Relacional.MAYORQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION MENORIQ EXPRESION                {$$ = new Relacionales.default(Relacionales.Relacional.MENORIGUALQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION MAYORIQ EXPRESION                {$$ = new Relacionales.default(Relacionales.Relacional.MAYORIGUALQUE, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION DOBIGUAL EXPRESION               {$$ = new Relacionales.default(Relacionales.Relacional.DOBLEIGUAL, @1.first_line, @1.first_column, $1, $3);}
           | EXPRESION NOTIGUAL EXPRESION               {$$ = new Relacionales.default(Relacionales.Relacional.NOIGUAL, @1.first_line, @1.first_column, $1, $3);}
;

SENTIF : TKIF PARI EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED           {$$ = new If.default($3, $6, null, @1.first_line, @1.first_column);}
       | TKIF PARI EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED SENTELSE  {$$ = new If.default($3, $6, $8, @1.first_line, @1.first_column);}
;

SENTELSE : TKELSE TKIF                           {let ArreIf = []; ArreIf.push($2); $$ = ArreIf;}
         | TKELSE LLAVEI INSTRUCCIONES LLAVED    {$$ = $3;}
;


SENTWHILE : TKWHILE PARI EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED   {$$ = new While.default($3, $6, @1.first_line, @1.first_column);}
;

SENTFOR : TKFOR PARI DECVARIABLE PUNTOCOMA EXPRESION PUNTOCOMA EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED {$$ = new For.default($3, $5, $7, $10, @1.first_line, @1.first_column); console.log("ent 1");}
        | TKFOR PARI ASIGNACION PUNTOCOMA EXPRESION PUNTOCOMA EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED  {$$ = new For.default($3, $5, $7, $10, @1.first_line, @1.first_column); console.log("ent 2");}
;

SENTBREAK : TKBREAK PUNTOCOMA                      {$$ = new Break.default(@1.first_line, @1.first_column);}
;

SENTDOWHILE : TKDO LLAVEI INSTRUCCIONES LLAVED TKWHILE PARI EXPRESION PARD  {$$ = new Dowhile.default($7, $3, @1.first_line, @1.first_column);}
;

/*
{$$ =  en jison es igual a Result = en cup}
{$4 esta accediendo a el numero 4 de la gramatica en cuestion TKREDONDEAR PARI EXPRESION PARD $4 es PARD}
*/