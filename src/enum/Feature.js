//特征类型
let vidValid=()=>{return true;}
let mobileValid=(v)=>{ 
        let res= /^1[3|4|5|7|8][0-9]{9}$/.test(v);
        if(!res){_t.info('手机格式不正确!');}

        return res;
    };

let certValid=(v)=>{ 
    let res= /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v);
    if(!res){_t.info('身份证格式不正确!');}

    return res;
};

let macValid=(v)=>{
    let idReg = /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/; //MAC
    let macReg= /^([A-Fa-f0-9]{2}){5}[A-Fa-f0-9]{2}$/; //MAC
    let res =idReg.test(v) || macReg.test(v);
    if(!res){_t.info('MAC格式不正确!');}

    return res;
};

let imsiValid=(v)=>{
    let res= /^4600[0,1,2,3,4,5,6,7,8,9]\d{10}$/g.test(v);
    if(!res){_t.info('IMSI格式不正确!');}

    return res;
};

let imeiValid=(v)=>{
    let res= /(^\d{15}$)|(^\d{17}$)/.test(v)
    if(!res){_t.info('IMEI格式不正确!');}

    return res;
};

let types=[
    {name:'虚拟身份',val:'vid',valid:vidValid},
    {name:'手机',val:'mobile',valid:mobileValid},
    {name:'身份证',val:'cert',valid:certValid},
    {name:'MAC',val:'mac',valid:macValid},
    {name:'IMSI',val:'imsi',valid:imsiValid},
    {name:'IMEI',val:'imei',valid:imeiValid}
];

export function valid(type,v){
    let t=_.find(types,t=>t.val==type);

    return t && t.valid(v);
}

export default types