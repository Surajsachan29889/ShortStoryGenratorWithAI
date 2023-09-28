 export default function Prompt(props){
    return (
        

        <div className="p-6 max-w-sm mt-5 bg-white border-[#cecdcd] border-2 rounded-xl shadow-lg flex items-center space-x-4 h-[50%] w-[18vw] hover:bg-slate-200 transition font-mono prompt" onClick={props.onClick}>
            <div className="shrink-0 border-2 border-[grey] w-8 h-8 rounded-lg text-center">
                <i class={props.icon}></i>
            </div>    
            <div>
                <div className="text-xl font-bold text-black mt-3 ">{props.text}</div>
                <p className="mb-5">
                    {props.para}
                </p>
            </div>
        </div>

    );
 }