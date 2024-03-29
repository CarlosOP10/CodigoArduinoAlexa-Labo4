// sets up dependencies
const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const IoTData = new AWS.IotData({endpoint: ''});

const TurnOnParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "ON_ALL_LEDS"}',
    qos: 0
};

const TurnOffParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "OFF_ALL_LEDS"}',
    qos: 0
};

const OnLedYellowParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "ON_LED_YELLOW"}',
    qos: 0
};

const OffLedYellowParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "OFF_LED_YELLOW"}',
    qos: 0
};

const OnLedBlueParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "ON_LED_BLUE"}',
    qos: 0
};

const OffLedBlueParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "OFF_LED_BLUE"}',
    qos: 0
};

const OnLedGreenParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "ON_LED_GREEN"}',
    qos: 0
};

const OffLedGreenParams = {
    topic: 'ucb/esp_in',
    payload: '{"action": "OFF_LED_GREEN"}',
    qos: 0
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola, Bienvenido al Internet de las Cosas';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOnIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnIntent';
    },
    handle(handlerInput) {
        IoTData.publish(TurnOnParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Leds encendidos';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOffIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffIntent';
    },
    handle(handlerInput) {
        IoTData.publish(TurnOffParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Leds apagados';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OnLedYellowIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OnLedYellow';
    },
    handle(handlerInput) {
        IoTData.publish(OnLedYellowParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Encendido Led Amarillo';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OffLedYellowIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OffLedYellow';
    },
    handle(handlerInput) {
        IoTData.publish(OffLedYellowParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Apagado Led Amarillo';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OnLedBlueIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OnLedBlue';
    },
    handle(handlerInput) {
        IoTData.publish(OnLedBlueParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Encendido Led Azul';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OffLedBlueIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OffLedBlue';
    },
    handle(handlerInput) {
        IoTData.publish(OffLedBlueParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Apagado Led Azul';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OnLedGreenIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OnLedGreen';
    },
    handle(handlerInput) {
        IoTData.publish(OnLedGreenParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Encendido Led Verde';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const OffLedGreenIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OffLedGreen';
    },
    handle(handlerInput) {
        IoTData.publish(OffLedGreenParams, function(err, data) {
            if (err) {
                console.log(err);
            }
        });

        const speakOutput = 'Apagado Led Verde';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ReadSensorsSacabaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadSensorsSacaba';
    },
    async handle(handlerInput) {

        let sensors;

        function toggleGarageDoor() {
          return new Promise((resolve, reject) => {
            var params = {
              thingName: 'MCU_SACABA',
            }
          
            IoTData.getThingShadow(params, (err, data) => {
              if (err){
                console.log(err, err.stack)
                reject(`Failed to update thing shadow: ${err.errorMessage}`)
              }else{
                resolve(JSON.parse(data.payload))
              }
            })
          })
        }
        
        await toggleGarageDoor()
            .then((result) => sensors=result.state.desired)
            .catch((err) => console.log(err))
        
        
        const speakOutput = `En Sacaba la temperatura es ${sensors.temp} °C con un ${sensors.hum} % de humedad y un indice de calor de ${sensors.indCalor}, una distacia de ${sensors.ultrasonic} cm.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ReadSensorsQuillacolloIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadSensorsQuillacollo';
    },
    async handle(handlerInput) {

        let sensors;

        function toggleGarageDoor() {
          return new Promise((resolve, reject) => {
            var params = {
              thingName: 'MCU_QUILLACOLLO',
            }
          
            IoTData.getThingShadow(params, (err, data) => {
              if (err){
                console.log(err, err.stack)
                reject(`Failed to update thing shadow: ${err.errorMessage}`)
              }else{
                resolve(JSON.parse(data.payload))
              }
            })
          })
        }
        
        await toggleGarageDoor()
            .then((result) => sensors=result.state.desired)
            .catch((err) => console.log(err))
        
        
        const speakOutput = `En Quillacollo la temperatura es ${sensors.temp} °C con un ${sensors.hum} % de humedad y un indice de calor de ${sensors.indCalor}, una distacia de ${sensors.ultrasonic} cm.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ReadSensorsVintoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadSensorsVinto';
    },
    async handle(handlerInput) {

        let sensors;

        function toggleGarageDoor() {
          return new Promise((resolve, reject) => {
            var params = {
              thingName: 'MCU_VINTO',
            }
          
            IoTData.getThingShadow(params, (err, data) => {
              if (err){
                console.log(err, err.stack)
                reject(`Failed to update thing shadow: ${err.errorMessage}`)
              }else{
                resolve(JSON.parse(data.payload))
              }
            })
          })
        }
        
        await toggleGarageDoor()
            .then((result) => sensors=result.state.desired)
            .catch((err) => console.log(err))
        
        
        const speakOutput = `En Vinto la temperatura es ${sensors.temp} °C con un ${sensors.hum} % de humedad y un indice de calor de ${sensors.indCalor}, una distacia de ${sensors.ultrasonic} cm.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Tienes las opciones de encender y apagar';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Adios!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Por favor intenta de nuevo';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        TurnOnIntentHandler,
        TurnOffIntentHandler,
        OnLedYellowIntentHandler,
        OffLedYellowIntentHandler,
        OnLedBlueIntentHandler,
        OffLedBlueIntentHandler,
        OnLedGreenIntentHandler,
        OffLedGreenIntentHandler,
        ReadSensorsSacabaIntentHandler,
        ReadSensorsQuillacolloIntentHandler,
        ReadSensorsVintoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();