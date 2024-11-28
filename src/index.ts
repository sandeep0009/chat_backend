import { WebSocketServer ,WebSocket} from "ws";

const wss= new WebSocketServer({port:3000});


interface User{
    socket:WebSocket,
    room:string
}


let allSocket:User[]=[];
wss.on("connected",(socket)=>{
 // @ts-ignore
    socket.on("message",(message)=>{
         
        const parsedMessage=JSON.parse(message);
        if(parsedMessage.type=="join"){
            console.log("user joined room",parsedMessage.payload.roomId);
            allSocket.push({
                socket,
                room:parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type==="chat"){
            let currentUserRoom=null;
            for(let i=0;i<allSocket.length;i++){
                if(allSocket[i].socket==socket){
                    currentUserRoom=allSocket[i].room;
                }
            }


            for(let i=0;i<allSocket.length;i++){
                if (allSocket[i].room == currentUserRoom) {
                    allSocket[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
    })

})
