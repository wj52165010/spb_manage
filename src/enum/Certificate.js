let certValid=(v)=>{ 
    let res= /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v);

    return res;
};

let hkValid=(v)=>{ 
    let res= /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(v);
    

    return res;
};


let types=[
    {name:'港澳通行证验证',val:'vid',valid:hkValid},
    {name:'身份证',val:'111',valid:certValid}
];


export function valid(type,v){
    let t=_.find(types,t=>t.val==type);
    if(!t) return true;

    return t && t.valid(v);
}

export default types