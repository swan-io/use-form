var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,n=(t,r,a)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a,s=(e,t)=>{for(var r in t||(t={}))l.call(t,r)&&n(e,r,t[r]);if(a)for(var r of a(t))i.call(t,r)&&n(e,r,t[r]);return e};import{u as o,a as c,r as m,L as u,b as d,B as p,F as g,c as x,T as v,S as h,I as E,d as f,e as b,C as F,f as y,W as C,H as S,v as B,g as k,h as w,i as V,j as O,k as T,l as A,m as z,n as N,E as R,R as D,o as I,V as j,p as L,q as M,s as W}from"./vendor.39e38f1c.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const q=e=>{const{colors:a}=o(),[l]=c(e.href);return m.exports.createElement(u,(i=s({},e),n={style:s({borderRadius:4,color:a.gray[600],display:"flex",flexGrow:1,fontWeight:500,paddingBottom:5,paddingLeft:12,paddingRight:12,paddingTop:5},l&&{backgroundColor:a.green[100],color:a.green[700]})},t(i,r(n))));var i,n},P=m.exports.forwardRef((({error:e,label:t,onBlur:r,validation:a,strategy:l,placeholder:i,onChange:n,onChangeText:s,valid:o,validating:c,value:u},S)=>{const B=d();return m.exports.createElement(p,null,m.exports.createElement(g,{htmlFor:B,marginBottom:0},t),m.exports.createElement(x,{flexDirection:"row",marginBottom:2,alignItems:"center"},m.exports.createElement(v,{color:"gray.400",fontSize:14,fontWeight:"medium"},a),m.exports.createElement(h,{width:2}),m.exports.createElement(v,{color:"gray.500",fontSize:12,fontWeight:"medium"},l," ✨")),m.exports.createElement(E,null,m.exports.createElement(f,{id:B,ref:S,error:e,onBlur:r,placeholder:i,value:u,isInvalid:null!=e,onChange:e=>{null==n||n(e),null==s||s(e.target.value)}}),o&&m.exports.createElement(b,null,m.exports.createElement(F,{color:"green.500"})),c&&m.exports.createElement(b,null,m.exports.createElement(y,{color:"blue.500",size:"sm"})),null!=e&&m.exports.createElement(b,null,m.exports.createElement(C,{color:"red.500"}))),m.exports.createElement(p,{height:8},m.exports.createElement(h,{height:1}),null!=e&&m.exports.createElement(v,{color:"red.500",fontWeight:500,fontSize:14},e)))})),Y=({children:e,title:t,description:r})=>m.exports.createElement(x,{flexDirection:"column",flexGrow:1,flexShrink:1,overflowY:"scroll",paddingTop:{base:6,md:8},paddingBottom:{base:6,md:8},paddingLeft:{base:5,md:10},paddingRight:{base:5,md:10}},m.exports.createElement("main",{style:{maxWidth:768}},m.exports.createElement(S,null,t),r?m.exports.createElement(m.exports.Fragment,null,m.exports.createElement(h,{height:4}),m.exports.createElement(v,{color:"gray.500"},r),m.exports.createElement(h,{height:12})):m.exports.createElement(h,{height:8}),e)),$=(e,t)=>new Promise((r=>{setTimeout((()=>r(t)),e)})),J=()=>{const{Field:e,resetForm:t,submitForm:r,formStatus:a}=B({emailAddress:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!k.isEmail(e))return"A valid email is required"}}}),l=w(),i=e=>{e.preventDefault(),r((e=>$(2e3).then((()=>{console.log("values",e),l({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}))),(e=>{console.log("errors",e),l({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Async submission",description:"Even if we do not recommend preventing the submission of the form until all the values in it are valid (which is a bad UX practice), the library still handle async submission just fine 🔥."},m.exports.createElement("form",{onSubmit:i},m.exports.createElement(e,{name:"emailAddress"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Email address",validation:"Must be valid",strategy:"onFirstSuccessOrFirstBlur",placeholder:"john.doe@example.org",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",disabled:"submitting"===a,isLoading:"submitting"===a,type:"submit",onClick:i},"Submit"))))},G=()=>{const{Field:e,resetForm:t,submitForm:r}=B({emailAddress:{strategy:"onFirstChange",initialValue:"",debounceInterval:250,sanitize:e=>e.trim(),validate:e=>$(1e3,k.isEmail(e)?void 0:"A valid email is required")}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Async validation",description:m.exports.createElement(m.exports.Fragment,null,"Validation will be triggered on each keystroke, ",m.exports.createElement(T,null,"debounceInterval")," is set to"," ",m.exports.createElement(T,null,"250")," (ms).")},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"emailAddress"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Email address",validation:"Must be valid",strategy:"onFirstChange",placeholder:"john.doe@example.org",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},U=()=>{const{Field:e,resetForm:t,submitForm:r}=B({firstName:{strategy:"onFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(""===e)return"First name is required"}},lastName:{strategy:"onFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(""===e)return"Last name is required"}},emailAddress:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!k.isEmail(e))return"A valid email is required"}}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Basic",description:m.exports.createElement(m.exports.Fragment,null,"A common form example which play with at least two different strategies.",m.exports.createElement("br",null),"Note that all values are sanitized using trimming.")},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"firstName"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"First name",validation:"Required",strategy:"onFirstBlur",placeholder:"John",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"lastName"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Last name",validation:"Required",strategy:"onFirstBlur",placeholder:"Doe",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"emailAddress"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Email address",validation:"Must be valid",strategy:"onFirstSuccessOrFirstBlur",placeholder:"john.doe@example.org",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},X=()=>{const{Field:e,resetForm:t,submitForm:r}=B({termsAndConditions:{strategy:"onFirstChange",initialValue:!1,validate:e=>{if(!e)return"You must accept terms and conditions"}},emailsFromPartners:{strategy:"onFirstChange",initialValue:!1,validate:e=>{if(!e)return"You must accept to receive email from partners"}}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Checkboxes",description:m.exports.createElement(m.exports.Fragment,null,"Checkboxes that must be ticked are a great use-case for ",m.exports.createElement(T,null,"onFirstChange")," ","validation strategy.")},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"termsAndConditions"},(({error:e,onChange:t,value:r})=>m.exports.createElement(A,{display:"flex",isInvalid:null!=e,isChecked:r,onChange:e=>t(e.target.checked),color:"gray.600"},"Accept terms and conditions"))),m.exports.createElement(h,{height:1}),m.exports.createElement(e,{name:"emailsFromPartners"},(({error:e,onChange:t,value:r})=>m.exports.createElement(A,{display:"flex",isInvalid:null!=e,isChecked:r,onChange:e=>t(e.target.checked),color:"gray.600"},"Receive emails from partners"))),m.exports.createElement(h,{height:12}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},H=()=>{const{Field:e,resetForm:t,submitForm:r}=B({cardNumber:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!z.number(e).isValid)return"Card number is invalid"}},expirationDate:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!z.expirationDate(e).isValid)return"Expiration date is invalid"}},cvc:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!z.cvv(e).isValid)return"CVC should have 3 characters"}}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Credit card",description:m.exports.createElement(m.exports.Fragment,null,"You can try it by yourself using random credit card numbers from"," ",m.exports.createElement(N,{href:"https://www.creditcardvalidator.org/generator",isExternal:!0,color:"gray.600",fontWeight:"medium"},"creditcardvalidator.org ",m.exports.createElement(R,{marginTop:-1})),m.exports.createElement("br",null),"Validation is performed using"," ",m.exports.createElement(N,{href:"https://www.npmjs.com/package/card-validator",isExternal:!0,color:"gray.600",fontWeight:"medium"},"card-validator ",m.exports.createElement(R,{marginTop:-1})))},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"cardNumber"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Card number",validation:"Must be valid",placeholder:"4242424242424242",strategy:"onFirstSuccessOrFirstBlur",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"expirationDate"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Expiration date",validation:"Must be valid",placeholder:"01/28",strategy:"onFirstSuccessOrFirstBlur",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"cvc"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"CVC",validation:"Must be valid",placeholder:"123",strategy:"onFirstSuccessOrFirstBlur",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},K=()=>{const{Field:e,FieldsListener:t,resetForm:r,submitForm:a}=B({firstName:{strategy:"onFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(""===e)return"First name is required"}},lastName:{strategy:"onFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(""===e)return"Last name is required"}},emailAddress:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!k.isEmail(e))return"A valid email is required"}}}),l=w(),i=e=>{e.preventDefault(),a((e=>{console.log("values",e),l({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),l({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Fields listener",description:m.exports.createElement(m.exports.Fragment,null,"Using ",m.exports.createElement(T,null,"listenFields")," and the ",m.exports.createElement(T,null,"<FieldsListener />")," component, it's really easy to synchronise components states and perform side-effects several fields values changes.")},m.exports.createElement(t,{names:["firstName","lastName","emailAddress"]},(e=>m.exports.createElement("pre",{style:{backgroundColor:"#fafafa",borderRadius:6,borderWidth:1,fontSize:14,padding:12}},JSON.stringify(e,null,2)))),m.exports.createElement(h,{height:8}),m.exports.createElement("form",{onSubmit:i},m.exports.createElement(e,{name:"firstName"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"First name",validation:"Required",strategy:"onFirstBlur",placeholder:"John",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"lastName"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Last name",validation:"Required",strategy:"onFirstBlur",placeholder:"Doe",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"emailAddress"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"Email address",validation:"Must be valid",strategy:"onFirstSuccessOrFirstBlur",placeholder:"john.doe@example.org",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:r},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:i,type:"submit"},"Submit"))))},Q=()=>{const{Field:e,resetForm:t,submitForm:r}=B({iban:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!k.isIBAN(e))return"Value is not a valid IBAN"}}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"IBAN",description:m.exports.createElement(m.exports.Fragment,null,"You can try it by yourself using random IBAN from"," ",m.exports.createElement(N,{href:"http://randomiban.com",isExternal:!0,color:"gray.600",fontWeight:"medium"},"randomiban.com ",m.exports.createElement(R,{marginTop:-1})),m.exports.createElement("br",null),"Validation is performed using"," ",m.exports.createElement(N,{href:"https://www.npmjs.com/package/validator",isExternal:!0,color:"gray.600",fontWeight:"medium"},"validator ",m.exports.createElement(R,{marginTop:-1})))},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"iban"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"IBAN",validation:"Must be valid",placeholder:"FR2230003000403598356122X09",strategy:"onFirstSuccessOrFirstBlur",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},Z=e=>{const t=(e.match(/\d+/g)||[]).join("").split("").reduce(((e,t,r)=>[4,8,12,16].includes(r)?`${e} ${t}`:`${e}${t}`),"").substr(0,19);return e.endsWith(" ")&&[4,9,14,19].includes(t.length)?`${t} `:t},_=e=>[4,9,14].includes(e.length)?`${e} `:e,ee=()=>{const{Field:e,resetForm:t,submitForm:r}=B({cardNumber:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:e=>e.trim(),validate:e=>{if(!z.number(e).isValid)return"Card number is invalid"}}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Input masking",description:m.exports.createElement(m.exports.Fragment,null,"You can try it by yourself using random credit card numbers from"," ",m.exports.createElement(N,{href:"https://www.creditcardvalidator.org/generator",isExternal:!0,color:"gray.600",fontWeight:"medium"},"creditcardvalidator.org ",m.exports.createElement(R,{marginTop:-1})),m.exports.createElement("br",null),"Validation is performed using"," ",m.exports.createElement(N,{href:"https://www.npmjs.com/package/card-validator",isExternal:!0,color:"gray.600",fontWeight:"medium"},"card-validator ",m.exports.createElement(R,{marginTop:-1})))},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"cardNumber"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(D,{accept:/\d+/g,mask:19<=n.length,format:Z,value:n,onChange:r,append:_},(({value:r,onChange:n})=>m.exports.createElement(P,{label:"Card number",validation:"Must be valid",placeholder:"4242424242424242",strategy:"onFirstSuccessOrFirstBlur",error:e,onBlur:t,onChange:n,ref:a,valid:l,validating:i,value:r}))))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},te=e=>e.trim(),re=e=>{if(e.length<3)return"Must be at least 3 characters"},ae=()=>{const{Field:e,resetForm:t,submitForm:r}=B({onFirstChange:{strategy:"onFirstChange",initialValue:"",sanitize:te,validate:re},onFirstSuccess:{strategy:"onFirstSuccess",initialValue:"",sanitize:te,validate:re},onFirstBlur:{strategy:"onFirstBlur",initialValue:"",sanitize:te,validate:re},onFirstSuccessOrFirstBlur:{strategy:"onFirstSuccessOrFirstBlur",initialValue:"",sanitize:te,validate:re},onSubmit:{strategy:"onSubmit",initialValue:"",sanitize:te,validate:re}}),a=w(),l=e=>{e.preventDefault(),r((e=>{console.log("values",e),a({title:"Submission succeeded",status:"success",duration:5e3,isClosable:!0})}),(e=>{console.log("errors",e),a({title:"Submission failed",status:"error",duration:5e3,isClosable:!0})}))};return m.exports.createElement(Y,{title:"Validation strategies",description:"All these fields use the same sanitization rules (the value is trimmed), the same validation rule (the value must be at least 3 characters long) but different validation strategies, so you can easily play with each."},m.exports.createElement("form",{onSubmit:l},m.exports.createElement(e,{name:"onFirstChange"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"onFirstChange",validation:"Must be at least 3 characters long",strategy:"onFirstChange",placeholder:"…",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"onFirstSuccess"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"onFirstSuccess",validation:"Must be at least 3 characters long",strategy:"onFirstSuccess",placeholder:"…",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"onFirstBlur"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"onFirstBlur",validation:"Must be at least 3 characters long",strategy:"onFirstBlur",placeholder:"…",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"onFirstSuccessOrFirstBlur"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"onFirstSuccessOrFirstBlur (default)",validation:"Must be at least 3 characters long",strategy:"onFirstSuccessOrFirstBlur",placeholder:"…",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(e,{name:"onSubmit"},(({error:e,onBlur:t,onChange:r,ref:a,valid:l,validating:i,value:n})=>m.exports.createElement(P,{label:"onSubmit",validation:"Must be at least 3 characters long",strategy:"onSubmit",placeholder:"…",error:e,onBlur:t,onChangeText:r,ref:a,valid:l,validating:i,value:n}))),m.exports.createElement(h,{height:4}),m.exports.createElement(V,{spacing:3},m.exports.createElement(O,{onClick:t},"Reset"),m.exports.createElement(O,{colorScheme:"green",onClick:l,type:"submit"},"Submit"))))},le=()=>m.exports.createElement(I,{base:"/react-ux-form"},m.exports.createElement(x,{flex:1,flexDirection:{base:"column",md:"row"}},m.exports.createElement(x,{backgroundColor:"gray.50",flexDirection:"column",overflowY:"scroll",paddingTop:6,paddingBottom:6,paddingLeft:4,paddingRight:4,borderColor:"gray.100",borderStyle:"solid",borderBottomWidth:1,flexShrink:0,height:{base:175,md:"auto"},width:{base:"auto",md:300}},m.exports.createElement(v,{color:"gray.500",fontSize:12,fontWeight:600,marginLeft:3,textTransform:"uppercase"},"Examples"),m.exports.createElement(p,{height:3}),m.exports.createElement(j,{align:"initial",spacing:1},m.exports.createElement(q,{href:"/"},"Basic"),m.exports.createElement(q,{href:"/strategies"},"Validation strategies"),m.exports.createElement(q,{href:"/fields-listener"},"Fields listener"),m.exports.createElement(q,{href:"/async-validation"},"Async validation"),m.exports.createElement(q,{href:"/async-submission"},"Async submission"),m.exports.createElement(q,{href:"/checkboxes"},"Checkboxes"),m.exports.createElement(q,{href:"/iban"},"IBAN"),m.exports.createElement(q,{href:"/credit-card"},"Credit card"),m.exports.createElement(q,{href:"/input-masking"},"Input masking"))),m.exports.createElement(L,{path:"/",component:U}),m.exports.createElement(L,{path:"/strategies",component:ae}),m.exports.createElement(L,{path:"/fields-listener",component:K}),m.exports.createElement(L,{path:"/async-validation",component:G}),m.exports.createElement(L,{path:"/async-submission",component:J}),m.exports.createElement(L,{path:"/checkboxes",component:X}),m.exports.createElement(L,{path:"/iban",component:Q}),m.exports.createElement(L,{path:"/credit-card",component:H}),m.exports.createElement(L,{path:"/input-masking",component:ee})));M.exports.render(m.exports.createElement(W,null,m.exports.createElement(le,null)),document.getElementById("root"));
//# sourceMappingURL=index.4c168299.js.map