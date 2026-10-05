(function (root) {
  'use strict';
  const defaults = {let:'let',print:'say',if:'when',else:'otherwise',repeat:'repeat',while:'while',for:'for',in:'in',end:'end',function:'fn',return:'return',input:'ask',true:'true',false:'false',and:'and',or:'or',not:'not'};
  const builtinNames = ['len','number','text','round','sqrt','abs','min','max','range','push','pop','join','split','upper','lower','floor','ceil','random','reverse','contains'];
  const identifier = /^[\p{L}_][\p{L}\p{M}\p{N}_]*$/u;
  class LanguageError extends Error {
    constructor(message, line=1) { super(message); this.name='LanguageError'; this.line=line; }
  }
  function validate(def) {
    const errors=[];
    if(!def || typeof def!=='object') return ['Choose a valid language definition.'];
    if(typeof def.name!=='string'||!def.name.trim()||def.name.length>40) errors.push('Give your language a name (1–40 characters).');
    if(typeof def.extension!=='string'||!(/^[a-z][a-z0-9]{0,11}$/).test(def.extension)) errors.push('File extension: use 1–12 lowercase letters or digits, starting with a letter.');
    const used=new Set();
    const kw = { ...defaults, ...(def.keywords || {}) };
    for(const key of Object.keys(defaults)) {
      const word=kw[key];
      if(typeof word!=='string'||!identifier.test(word)||word.length>30) errors.push(`${key}: use one word, beginning with a letter or underscore (up to 30 characters).`);
      else if(used.has(word)||builtinNames.includes(word)) errors.push(`“${word}” is already used. Give each keyword its own word.`);
      used.add(word);
    }
    return errors;
  }
  function tokenize(source, keywords) {
    if(typeof source!=='string'||source.length>100000) throw new LanguageError('Program must be text under 100,000 characters.');
    const reverse=new Map(Object.entries(keywords).map(([k,v])=>[v,k]));
    const tokens=[]; let i=0,line=1;
    const add=(type,value,raw=value)=>tokens.push({type,value,raw,line});
    while(i<source.length) {
      const c=source[i];
      if(c===' '||c==='\t'||c==='\r'){i++;continue;}
      if(c==='\n'||c===';'){add('nl','\n');if(c==='\n')line++;i++;continue;}
      if(c==='#'){while(i<source.length&&source[i]!=='\n')i++;continue;}
      if(c==='"'||c==="'") {
        const start=i++, startLine=line; let value='',closed=false;
        while(i<source.length){const ch=source[i++];if(ch===c){closed=true;break;}if(ch==='\n')throw new LanguageError('Close the string before the next line.',startLine);
          if(ch==='\\'){const esc=source[i++];const escapes={n:'\n',t:'\t',r:'\r','\\':'\\','"':'"',"'":"'"};if(!(esc in escapes))throw new LanguageError('Unknown string escape.',line);value+=escapes[esc];}else value+=ch;
        }
        if(!closed)throw new LanguageError('This string needs a closing quote.',startLine);
        add('string',value,source.slice(start,i));continue;
      }
      if(/[0-9]/.test(c)) {const match=source.slice(i).match(/^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/)[0];const n=Number(match);if(!Number.isFinite(n))throw new LanguageError('Number is too large.',line);add('number',n,match);i+=match.length;continue;}
      if(/[\p{L}_]/u.test(c)){const start=i++;while(i<source.length&&/[\p{L}\p{M}\p{N}_]/u.test(source[i]))i++;const word=source.slice(start,i);add(reverse.has(word)?'kw':'id',reverse.get(word)??word,word);continue;}
      const double=source.slice(i,i+2);
      if(['==','!=','<=','>=','**'].includes(double)){add('op',double);i+=2;continue;}
      if('+-*/%<>=(),[]'.includes(c)){add('op',c);i++;continue;}
      throw new LanguageError(`Unexpected character “${c}”.`,line);
    }
    tokens.push({type:'eof',value:'',line});return tokens;
  }
  class Parser {
    constructor(tokens,keywords){this.t=tokens;this.i=0;this.k=keywords;this.depth=0;}
    at(type,value){const t=this.t[this.i];return t.type===type&&(value===undefined||t.value===value);}
    take(type,value){if(this.at(type,value))return this.t[this.i++];return null;}
    need(type,value,message){const t=this.take(type,value);if(!t)throw new LanguageError(message??`Expected “${value}”.`,this.t[this.i].line);return t;}
    blank(){while(this.take('nl')){}}
    newline(){if(!this.at('eof'))this.need('nl',undefined,'Put the next statement on a new line.');this.blank();}
    block(stops=[]){if(++this.depth>80)throw new LanguageError('Too many nested blocks.',this.t[this.i].line);const body=[];this.blank();while(!this.at('eof')&&!(this.at('kw')&&stops.includes(this.t[this.i].value))){body.push(this.statement());this.blank();}this.depth--;return body;}
    statement(){const token=this.t[this.i],line=token.line;let node;
      if(this.take('kw','let')){const name=this.need('id',undefined,'Choose a variable name that is not a keyword.').value;this.need('op','=');node={kind:'let',name,value:this.expr(),line};}
      else if(this.take('kw','print'))node={kind:'print',value:this.expr(),line};
      else if(this.take('kw','return'))node={kind:'return',value:this.at('nl')||this.at('eof')?{kind:'literal',value:null,line}:this.expr(),line};
      else if(this.take('kw','if')){const condition=this.expr();this.newline();const yes=this.block(['else','end']);let no=[];if(this.take('kw','else')){this.newline();no=this.block(['end']);}this.need('kw','end',`Close this block with “${this.k.end}”.`);node={kind:'if',condition,yes,no,line};}
      else if(this.at('kw','repeat')||this.at('kw','while')){const kind=this.t[this.i++].value;const condition=this.expr();this.newline();const body=this.block(['end']);this.need('kw','end',`Close this block with “${this.k.end}”.`);node={kind,condition,body,line};}
      else if(this.take('kw','for')){const variable=this.need('id',undefined,'Choose a loop variable name that is not a keyword.').value;this.need('kw','in',`Expected “${this.k.in}” after variable name.`);const iterable=this.expr();this.newline();const body=this.block(['end']);this.need('kw','end',`Close this block with “${this.k.end}”.`);node={kind:'for',variable,iterable,body,line};}
      else if(this.take('kw','function')){const name=this.need('id',undefined,'Choose a function name that is not a keyword.').value;this.need('op','(');const params=[];if(!this.at('op',')'))do{params.push(this.need('id',undefined,'Expected a parameter name.').value);}while(this.take('op',','));this.need('op',')');if(new Set(params).size!==params.length)throw new LanguageError('Function parameters must have different names.',line);this.newline();const body=this.block(['end']);this.need('kw','end',`Close this function with “${this.k.end}”.`);node={kind:'function',name,params,body,line};}
      else if(this.at('id')&&this.t[this.i+1]?.value==='='){const name=this.t[this.i++].value;this.i++;node={kind:'assign',name,value:this.expr(),line};}
      else node={kind:'expression',value:this.expr(),line};
      this.newline();return node;
    }
    expr(min=0){if(++this.depth>80)throw new LanguageError('Expression is nested too deeply.',this.t[this.i].line);let left=this.atom();
      const levels={or:1,and:2,'==':3,'!=':3,'<':4,'<=':4,'>':4,'>=':4,'+':5,'-':5,'*':6,'/':6,'%':6,'**':7};
      while(true){const t=this.t[this.i],power=levels[t.value];if(!['op','kw'].includes(t.type)||power===undefined||power<min)break;this.i++;const right=this.expr(power+(t.value==='**'?0:1));left={kind:'binary',op:t.value,left,right,line:t.line};}
      this.depth--;return left;
    }
    atom(){const t=this.t[this.i++];let node;
      if(t.type==='number'||t.type==='string')node={kind:'literal',value:t.value,line:t.line};
      else if(t.type==='kw'&&['true','false'].includes(t.value))node={kind:'literal',value:t.value==='true',line:t.line};
      else if((t.type==='op'&&['-','+'].includes(t.value))||(t.type==='kw'&&t.value==='not'))node={kind:'unary',op:t.value,value:this.expr(7),line:t.line};
      else if(t.type==='id'||(t.type==='kw'&&t.value==='input'))node={kind:'name',name:t.type==='kw'?'@input':t.value,line:t.line};
      else if(t.type==='op'&&t.value==='('){node=this.expr();this.need('op',')');}
      else if(t.type==='op'&&t.value==='['){const items=[];if(!this.at('op',']'))do{items.push(this.expr());}while(this.take('op',','));this.need('op',']');node={kind:'array',items,line:t.line};}
      else throw new LanguageError(`Expected a value${t.type==='eof'?'':`, found “${t.raw??t.value}”`}.`,t.line);
      while(this.at('op','(')||this.at('op','[')) {
        if(this.take('op','(')){const args=[];if(!this.at('op',')'))do{args.push(this.expr());}while(this.take('op',','));this.need('op',')');node={kind:'call',target:node,args,line:t.line};}
        else{this.i++;const index=this.expr();this.need('op',']');node={kind:'index',target:node,index,line:t.line};}
      }
      return node;
    }
  }
  class Scope {
    constructor(parent=null){this.values=new Map();this.parent=parent;}
    get(name,line){if(this.values.has(name))return this.values.get(name);if(this.parent)return this.parent.get(name,line);throw new LanguageError(`“${name}” is not defined.`,line);}
    set(name,value,line){if(this.values.has(name)){this.values.set(name,value);return;}if(this.parent){this.parent.set(name,value,line);return;}throw new LanguageError(`Declare “${name}” before assigning it.`,line);}
  }
  function execute(source,definition,input='',options={}) {
    const kw = { ...defaults, ...(definition?.keywords || {}) };
    definition = { ...(definition || {}), keywords: kw };
    const errors=validate(definition);if(errors.length)throw new LanguageError(errors[0]);
    const started=Date.now(), output=[], scope=new Scope();let steps=0,calls=0,inputIndex=0,outputSize=0;
    const inputLines=String(input).replace(/\r/g,'').split('\n');if(input==='')inputLines.length=0;
    const tree=new Parser(tokenize(source,definition.keywords),definition.keywords).block();
    const tick=(line)=>{if(++steps>(options.maxSteps??100000)||Date.now()-started>4000)throw new LanguageError('Execution limit reached. Check for an endless loop.',line);};
    const format=v=>v===null?'nothing':typeof v==='boolean'?definition.keywords[String(v)]:Array.isArray(v)?'['+v.map(format).join(', ')+']':typeof v==='object'?'[function]':String(v);
    const emit=(v,line)=>{const value=format(v);outputSize+=value.length;if(output.length>=2000||outputSize>100000)throw new LanguageError('Output limit reached. Print fewer values.',line);output.push(value);options.onOutput?.(value);};
    const numeric=(v,line)=>{if(typeof v!=='number'||!Number.isFinite(v))throw new LanguageError('This operation needs a number. Use number(value) to convert text.',line);return v;};
    const truth=v=>Array.isArray(v)?v.length>0:Boolean(v);
    const install=(name,min,max,run)=>scope.values.set(name,{builtin:run,min,max});
    install('@input',0,1,(args,line)=>{if(args.length)emit(args[0],line);if(inputIndex>=inputLines.length)throw new LanguageError('Input is empty. Add one value per line in Program input.',line);return inputLines[inputIndex++];});
    install('len',1,1,([v],line)=>{if(typeof v!=='string'&&!Array.isArray(v))throw new LanguageError('len() needs text or a list.',line);return v.length;});
    install('number',1,1,([v],line)=>{if(typeof v==='object'||String(v).trim()===''||!Number.isFinite(Number(v)))throw new LanguageError('Cannot convert this value into a number.',line);return Number(v);});
    install('text',1,1,([v])=>format(v));
    for(const name of ['round','sqrt','abs'])install(name,1,1,([v],line)=>{const result=Math[name](numeric(v,line));if(!Number.isFinite(result))throw new LanguageError(`${name}() cannot use this value.`,line);return result;});
    for(const name of ['min','max'])install(name,1,100,(args,line)=>Math[name](...args.map(v=>numeric(v,line))));
    install('range',1,3,(args,line)=>{
      let start=0,stop=0,step=1;
      if(args.length===1){stop=numeric(args[0],line);}
      else if(args.length===2){start=numeric(args[0],line);stop=numeric(args[1],line);}
      else{start=numeric(args[0],line);stop=numeric(args[1],line);step=numeric(args[2],line);}
      if(!Number.isInteger(start)||!Number.isInteger(stop)||!Number.isInteger(step))throw new LanguageError('range() requires integers.',line);
      if(step===0)throw new LanguageError('range() step cannot be zero.',line);
      const res=[];
      if(step>0){for(let v=start;v<stop;v+=step){if(res.length>=10000)throw new LanguageError('range() output too large.',line);res.push(v);}}
      else{for(let v=start;v>stop;v+=step){if(res.length>=10000)throw new LanguageError('range() output too large.',line);res.push(v);}}
      return res;
    });
    install('push',2,2,([list,item],line)=>{if(!Array.isArray(list))throw new LanguageError('push() needs a list.',line);if(list.length>=10000)throw new LanguageError('List too large.',line);list.push(item);return list;});
    install('pop',1,1,([list],line)=>{if(!Array.isArray(list))throw new LanguageError('pop() needs a list.',line);if(!list.length)throw new LanguageError('Cannot pop from empty list.',line);return list.pop();});
    install('join',1,2,([list,sep=', '],line)=>{if(!Array.isArray(list))throw new LanguageError('join() needs a list.',line);return list.map(format).join(String(sep));});
    install('split',1,2,([str,sep=' '],line)=>{if(typeof str!=='string')throw new LanguageError('split() needs text.',line);return str.split(String(sep));});
    install('upper',1,1,([str],line)=>{if(typeof str!=='string')throw new LanguageError('upper() needs text.',line);return str.toUpperCase();});
    install('lower',1,1,([str],line)=>{if(typeof str!=='string')throw new LanguageError('lower() needs text.',line);return str.toLowerCase();});
    install('floor',1,1,([v],line)=>Math.floor(numeric(v,line)));
    install('ceil',1,1,([v],line)=>Math.ceil(numeric(v,line)));
    install('random',0,2,(args,line)=>{
      if(!args.length)return Math.random();
      if(args.length===1){const m=numeric(args[0],line);return Math.floor(Math.random()*(m+1));}
      const min=numeric(args[0],line),max=numeric(args[1],line);
      if(min>max)throw new LanguageError('random() minimum cannot exceed maximum.',line);
      return Math.floor(Math.random()*(max-min+1))+min;
    });
    install('reverse',1,1,([v],line)=>{if(Array.isArray(v))return[...v].reverse();if(typeof v==='string')return[...v].reverse().join('');throw new LanguageError('reverse() needs a list or text.',line);});
    install('contains',2,2,([coll,item],line)=>{if(Array.isArray(coll))return coll.some(x=>x===item);if(typeof coll==='string')return coll.includes(String(item));throw new LanguageError('contains() needs a list or text.',line);});
    function evalNode(n,s){tick(n.line);switch(n.kind){
      case'literal':return n.value;
      case'name':return s.get(n.name,n.line);
      case'array':return n.items.map(x=>evalNode(x,s));
      case'index':{const target=evalNode(n.target,s),index=evalNode(n.index,s);if((!Array.isArray(target)&&typeof target!=='string')||!Number.isInteger(index)||index<0||index>=target.length)throw new LanguageError('Index is outside the text or list. Indexes start at 0.',n.line);return target[index];}
      case'unary':{const v=evalNode(n.value,s);return n.op==='not'?!truth(v):n.op==='-'?-numeric(v,n.line):numeric(v,n.line);}
      case'binary':{const a=evalNode(n.left,s);if(n.op==='and')return truth(a)&&truth(evalNode(n.right,s));if(n.op==='or')return truth(a)||truth(evalNode(n.right,s));const b=evalNode(n.right,s);let value;
        if(n.op==='==')return a===b;if(n.op==='!=')return a!==b;
        if(['<','<=','>','>='].includes(n.op)){if(typeof a!==typeof b||!['number','string'].includes(typeof a))throw new LanguageError('Compare two numbers or two text values.',n.line);return n.op==='<'?a<b:n.op==='<='?a<=b:n.op==='>'?a>b:a>=b;}
        if(n.op==='+'&&(typeof a==='string'||typeof b==='string'))value=format(a)+format(b);
        else{numeric(a,n.line);numeric(b,n.line);if((n.op==='/'||n.op==='%')&&b===0)throw new LanguageError('Cannot divide by zero.',n.line);value=n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:n.op==='/'?a/b:n.op==='%'?a%b:a**b;}
        if(typeof value==='number'&&!Number.isFinite(value))throw new LanguageError('Number is too large.',n.line);if(typeof value==='string'&&value.length>100000)throw new LanguageError('Text is too large.',n.line);return value;
      }
      case'call':{const fn=evalNode(n.target,s),args=n.args.map(x=>evalNode(x,s));if(!fn||typeof fn!=='object'||(!fn.builtin&&!fn.body))throw new LanguageError('Only functions can be called.',n.line);
        if(fn.builtin){if(args.length<fn.min||args.length>fn.max)throw new LanguageError(`Expected ${fn.min===fn.max?fn.min:`${fn.min}–${fn.max}`} argument(s).`,n.line);return fn.builtin(args,n.line);}
        if(args.length!==fn.params.length)throw new LanguageError(`Expected ${fn.params.length} argument(s).`,n.line);if(++calls>64)throw new LanguageError('Function call limit reached. Check recursion.',n.line);const child=new Scope(fn.scope);fn.params.forEach((p,i)=>child.values.set(p,args[i]));const result=runBlock(fn.body,child,true);calls--;return result?.value??null;
      }
    }}
    function runBlock(nodes,s,inFunction=false){for(const n of nodes){tick(n.line);switch(n.kind){
      case'let':if(s.values.has(n.name))throw new LanguageError(`“${n.name}” is already declared. Assign with ${n.name} = value.`,n.line);s.values.set(n.name,evalNode(n.value,s));break;
      case'assign':s.set(n.name,evalNode(n.value,s),n.line);break;
      case'print':emit(evalNode(n.value,s),n.line);break;
      case'expression':evalNode(n.value,s);break;
      case'function':if(s.values.has(n.name))throw new LanguageError(`“${n.name}” is already defined.`,n.line);s.values.set(n.name,{params:n.params,body:n.body,scope:s});break;
      case'return':if(!inFunction)throw new LanguageError('Return can only be used inside a function.',n.line);return {value:evalNode(n.value,s)};
      case'if':{const result=runBlock(truth(evalNode(n.condition,s))?n.yes:n.no,new Scope(s),inFunction);if(result)return result;break;}
      case'repeat':{const count=evalNode(n.condition,s);if(!Number.isInteger(count)||count<0||count>100000)throw new LanguageError('Repeat needs a whole number from 0 to 100,000.',n.line);for(let i=0;i<count;i++){tick(n.line);const result=runBlock(n.body,new Scope(s),inFunction);if(result)return result;}break;}
      case'while':while(truth(evalNode(n.condition,s))){tick(n.line);const result=runBlock(n.body,new Scope(s),inFunction);if(result)return result;}break;
      case'for':{const it=evalNode(n.iterable,s);if(!Array.isArray(it)&&typeof it!=='string')throw new LanguageError('Loop with for requires a list or text.',n.line);for(let idx=0;idx<it.length;idx++){tick(n.line);const child=new Scope(s);child.values.set(n.variable,it[idx]);const res=runBlock(n.body,child,inFunction);if(res)return res;}break;}
    }}}
    try{runBlock(tree,scope);}catch(error){error.output=output;throw error;}
    return {output,steps,duration:Date.now()-started};
  }
  const api={defaults,validate,execute,tokenize,LanguageError,version:'1.0.0'};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LangLab=api;
})(typeof globalThis!=='undefined'?globalThis:this);
