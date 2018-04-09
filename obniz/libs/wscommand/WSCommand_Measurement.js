const WSCommand = require("./WSCommand_.js");

class WSCommand_Measurement extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 12;

    this._CommandMeasurementEcho  = 0
  }

  // Commands

  echo(params) {
    let type = 0;
    let trigerIO = params.echo.io_pulse;
    let  trigerPosNeg = params.echo.pulse === "negative" ? false : true;
    let trigerWidthUs = parseInt(params.echo.pulse_width*1000);
    let echoIO = params.echo.io_echo;
    let responseCount = params.echo.measure_edges;
    let timeoutUs = params.echo.timeout * 1000;
    timeoutUs = parseInt(timeoutUs);

    var buf = new Uint8Array(13);
    buf[0]  = 0;
    buf[1]  = trigerIO;
    buf[2]  = trigerPosNeg ? 1 : 0;
    buf[3]  = trigerWidthUs >> 8*3;
    buf[4]  = trigerWidthUs >> 8*2;
    buf[5]  = trigerWidthUs >> 8;
    buf[6]  = trigerWidthUs;
    buf[7]  = echoIO;
    buf[8]  = responseCount;
    buf[9]  = timeoutUs >> 8*3;
    buf[10] = timeoutUs >> 8*2;
    buf[11] = timeoutUs >> 8;
    buf[12] = timeoutUs;
    this.sendCommand(this._CommandMeasurementEcho, buf);
  }

  parseFromJson(json) {
    var module = json["measure"];
    if (module === undefined) {
      return;
    }
    let schemaData = [
      {uri : "/request/measure/echo",    onValid: this.echo},
    ];
    let res = this.validateCommandSchema(schemaData, module, "measure");

    if(res.valid === 0){
      if(res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      }else{
        throw new this.WSCommandNotFoundError(`[measure]unknown command`);
      }
    }

  }
  
  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandMeasurementEcho) {
      var index = 0;
      var count = parseInt(payload[index++]);
      var array = [];
      for (var i=0; i<count; i++) {
        var timing;
        var edge = (payload[index++] > 0) ? true : false;
        timing  = payload[index++] << (8*3);
        timing += payload[index++] << (8*2);
        timing += payload[index++] << 8;
        timing += payload[index++];
        timing = timing / 1000;
        array.push({
          edge,
          timing
        })
      }
      objToSend["measure"] = {
        echo: array
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}


module.exports = WSCommand_Measurement;