/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
import DataViewObjects = powerbi.extensibility.utils.dataview.DataViewObjects;
interface Payload {
            assign : string, task : string ,  taskdescription : string,
            startdate : string , duedate : string
        };
module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private settings: VisualSettings;
        private urlNode: Text;
        private targetUrl: string;
        private staffUrl: string;
        
        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            if (typeof document !== "undefined") {
                // hidden url
                const new_ph = document.createElement("p");
                new_ph.setAttribute('id',"hidden_url");
                new_ph.setAttribute('class',"hidden_url)");
                new_ph.hidden = true;
                
                this.urlNode = document.createTextNode(this.targetUrl);
                new_ph.appendChild(this.urlNode);
                this.target.appendChild(new_ph);
                //
                let now = new Date();
                let day = ("0" + now.getDate()).slice(-2);
                let month = ("0" + (now.getMonth() + 1)).slice(-2);
                let today = now.getFullYear()+"-"+(month)+"-"+(day) ;
                const new_p0: HTMLElement = document.createElement("p");
                new_p0.appendChild(document.createTextNode("Start Date:"));
                const new_sd: HTMLInputElement = document.createElement("input");
                new_sd.setAttribute("type","date");
                new_sd.setAttribute("class","date");
                new_sd.value = today;
                new_p0.appendChild(new_sd);
                this.target.appendChild(new_p0);
                const new_p1: HTMLElement = document.createElement("p");
                new_p1.appendChild(document.createTextNode("Due Date:"));
                const new_dd: HTMLInputElement = document.createElement("input");
                new_dd.setAttribute("type","date");
                new_dd.setAttribute("class","date");
                new_dd.value = today;
                new_p1.appendChild(new_dd);
                this.target.appendChild(new_p1);
                const new_p2: HTMLElement= document.createElement("p");
                new_p2.appendChild(document.createTextNode("Assign:"));
                const new_as: HTMLSelectElement = document.createElement("select")
                new_as.id = "staffList";
                this.staffUrl = "";
                new_as.setAttribute("class","email");
                new_p2.appendChild(new_as);
                this.target.appendChild(new_p2);
                const new_p3: HTMLElement = document.createElement("p");
                new_p3.appendChild(document.createTextNode("Task"));
                const new_pd: HTMLInputElement = document.createElement("input");
                new_pd.setAttribute("type","text");
                new_pd.setAttribute("class","task");
                new_pd.setAttribute("id","task");
                new_p3.appendChild(new_pd);
                this.target.appendChild(new_p3);
                const new_p4: HTMLElement = document.createElement("p");
                new_p4.appendChild(document.createTextNode("Detail"));
                const new_at: HTMLTextAreaElement = document.createElement("textarea");
                new_at.setAttribute("type","textarea");
                new_at.setAttribute("class","multiline");
                new_at.setAttribute('id',"detail");
                new_p4.appendChild(new_at);
                this.target.appendChild(new_p4);
               // Button               
                const new_b = document.createElement("input");
                new_b.setAttribute('type', "submit");
                new_b.setAttribute('value', "Commit");
                new_b.setAttribute('id',"bUpdate");
                               
                new_b.onclick = function () { 
                                            let payload: Payload = {
                                                assign : new_as.value, 
                                                task : new_pd.value ,  
                                                taskdescription : new_at.value,
                                                startdate : new_sd.value , 
                                                duedate : new_dd.value
                                                }
                                            btnClick(payload,
                                                        new_ph.innerHTML 
                                                    ); };
                            
                this.target.appendChild(new_b) ;
                const new_p5 = document.createElement("p");
                new_p5.setAttribute('id',"final_msg");
                new_p5.hidden = true;
                var new_message = document.createTextNode("Task Assigned");
                new_p5.appendChild(new_message);
                this.target.appendChild(new_p5);
            }
            function btnClick(payload :Payload, targetUrl ){
                let sendData = JSON.stringify(payload);                   
                let elem = document.createElement('textarea');
                elem.innerHTML = targetUrl;
                let postUrl = elem.value;               
                $.ajax({
                    url: postUrl,
                    type:"POST",                              
                    data: sendData,
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data){                                    
                                    $('#final_msg').fadeIn(); ;                      
                                    setTimeout(function() {
                                        $('#final_msg').fadeOut();
                                       }, 10000 )
                                    },
                        
                    error: function( jqXhr, textStatus, errorThrown ){
                            alert(errorThrown);
                            alert(textStatus);
                        },                    
                    statusCode: {
                                202: function() {
                                    alert("202");
                                    }
                                }                          
                        });                                                   
            }
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log('Visual update', options);
            let dataViews = options.dataViews; 
            let categorical = dataViews[0].categorical; 
            let category = categorical.categories[0]; 
            let dataValue = categorical.values[0]; 
            let input = document.getElementById("task") as HTMLInputElement;
            input.value = String(category.values[0]);
            this.targetUrl = this.settings.url.targetUrl;         

            if (typeof this.urlNode !== "undefined") {
                 this.urlNode.textContent = this.targetUrl
            }
            if (this.staffUrl !== this.settings.staffList.targetUrl) {
                this.staffUrl = this.settings.staffList.targetUrl;
                document.getElementById('staffList').innerHTML = "";
                let selectList: HTMLElement = document.getElementById('staffList');
                fetch(this.staffUrl)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(staffList) {  
                        var person;   
                        for (person of staffList){
                        var option = document.createElement("option");
                        option.value = person.Email;
                        option.text = person.Name;
                        selectList.appendChild(option);
                        }
                    }); 
            }
            let detail: HTMLTextAreaElement = document.getElementById('detail') as HTMLTextAreaElement;
            let name = categorical.values[0].source.displayName;
            let value = categorical.values[0].values[0]
            detail.value = name + ": " + value;
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}