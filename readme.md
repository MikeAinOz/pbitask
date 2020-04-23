PBI Task
--------
This Power BI Custom Visual is used to send tasks to a service specified ny a URL. This is a demonstration module for https://paradigmbi.com.au/ 

This is all open source, please feel free to play with the code and acknowledge the sources, which are varied.

This visual is designed to be used with other visuals which select the a category for the task, in the demonstation we have used a product. The measure is used for the task description, both the measure name and it's value appear in the description, which can be modified.

There is a person drop down, this is uses a JSON file which we locate in blob storage and make accesssible.  The JSON is an array of names that looks like this: [{ "Name": "Zoe","Email": "zoe@yourdomain.com"}] . The location of the file is specified on the format tab.

The Visual sends a payload formatted like this: 
interface Payload {
            assign : string, 
            task : string ,  
            taskdescription : string,
            startdate : string , 
            duedate : string
        };
The URL destination of the payload is specified on the format tab.

The visual acknowledges a successful call to the destination service


Test Plan
---------

Preparation:

1. Create a http request in flow with this schema:
    {
    "type": "object",
    "properties": {
        "assign": {
        "type": "string"
        },
        "task": {
        "type": "string"
        },
        "taskdescription": {
        "type": "string"
        },
        "startdate": {
        "type": "string"
        },
        "duedate": {
        "type": "string"
        }
    }
    }
    2. Define Response Step with schema:
        {
    "type": "object",
    "properties": {
        "confirm": {
        "type": "string"
        }
    }
    }
    3. Create a staff list format [{ "Name": "Zoe","Email": "zoe@yourdomain.com"}]
    
    Start Visual:
    1. before testing -> npm audit fix
    2. start application -> pbiviz start
    3. Publish Test Report

    Tests
    1. Test Edge Condition on entry to Test Report , use Submit straight away, check output
    2. Standard Test: select a new product and modfy all task fields and Submit
    3. Fault test, turn Flow off and test

    Results
    1. Tested OK
    2. Tested OK
    3. No Message to indicate failure?



