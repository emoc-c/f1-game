from flask import Flask,request,jsonify
from flask_cors import CORS


app= Flask(__name__)
CORS(app)

logins=[]


@app.route('/')
def compute():
    x= request.args.get('x','0')
    y= request.args.get('y','0')
    log=request.args.get('log','-1')
    if(int(log)==-1):    
        newlog=len(logins)
        logins.append({"id":newlog,"x":int(x),"y":int(y)})
        return str(newlog)
    else:
        if(int(log)<len(logins) and int(log)>-1):
            logins[int(log)]={"id":int(log),"x":int(x),"y":int(y)}

            return jsonify(logins)
        else:
            return str(-1)