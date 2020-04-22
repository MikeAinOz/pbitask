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
1. npm audit fix -- before testing
