 export default function Responsebody(){
    return (
        <div className="flex flex-col gap-4">
            {/* client message */}
            <div className="border-[black] break-words bg-slate-300 border-[2px] rounded-xl self-end px-3 py-4 max-w-[80%] my-5 mx-10">
                <pre className="whitespaces">
                    <span>Hii this is testing</span>
                </pre>
            </div>
            <div className="border-[black]  bg-slate-300 break-words border-[2px] rounded-xl self-start px-3 py-4 max-w-[80%] mx-10">
                <pre className="whitespaces">
                    <span>Hii this is testing</span>
                </pre>
            </div>
            
        </div>

    
    );
 }