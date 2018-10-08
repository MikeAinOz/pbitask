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

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
            if (typeof document !== "undefined") {
                const new_p0: HTMLElement = document.createElement("p");
                new_p0.appendChild(document.createTextNode("Start Date:"));
                const new_sd: HTMLInputElement = document.createElement("input");
                new_sd.setAttribute("type","date");
                new_sd.setAttribute("class","date");
                new_sd.setAttribute("placeholder","dd-mm-yyyy");
                new_p0.appendChild(new_sd);
                this.target.appendChild(new_p0);
                const new_p1: HTMLElement = document.createElement("p");
                new_p1.appendChild(document.createTextNode("Due Date:"));
                const new_dd: HTMLInputElement = document.createElement("input");
                new_dd.setAttribute("type","date");
                new_dd.setAttribute("class","date");
                new_p1.appendChild(new_dd);
                this.target.appendChild(new_p1);
                const new_p2: HTMLElement= document.createElement("p");
                new_p2.appendChild(document.createTextNode("Assign:"));
                const new_as: HTMLInputElement = document.createElement("input")
                new_as.setAttribute("type","email");
                new_as.setAttribute("class","email");
                new_p2.appendChild(new_as);
                this.target.appendChild(new_p2);
                const new_p3: HTMLElement = document.createElement("p");
                new_p3.appendChild(document.createTextNode("Product"));
                const new_pd: HTMLInputElement = document.createElement("input");
                new_pd.setAttribute("type","text");
                new_pd.setAttribute("class","product");
                new_p3.appendChild(new_pd);
                this.target.appendChild(new_p3);
                const new_p4: HTMLElement = document.createElement("p");
                new_p4.appendChild(document.createTextNode("Task"));
                const new_at: HTMLTextAreaElement = document.createElement("textarea");
                new_at.setAttribute("type","textarea");
                new_at.setAttribute("class","multiline");
                new_p4.appendChild(new_at);
                this.target.appendChild(new_p4);
               // Button               
                const new_b = document.createElement("input");
                new_b.setAttribute('type', "submit");
                new_b.setAttribute('value', "Commit");
                new_b.setAttribute('id',"bUpdate");
                
                new_b.onclick = function () { btnClick(options.element, 
                                                        new_sd.value,
                                                        new_dd.value,
                                                        new_as.value,
                                                        new_pd.value,
                                                        new_at.value 
                                                    ); };
                            
                this.target.appendChild(new_b) ;
                const new_p5 = document.createElement("p");
                new_p5.setAttribute('id',"final_msg");
                new_p5.hidden = true;
                var new_message = document.createTextNode("Task Assigned");
                new_p5.appendChild(new_message);
                this.target.appendChild(new_p5);
            }
            function btnClick(target :HTMLElement, startdate,duedate,assign,product, task ){
                //alert(task);
                
                var sendTask = product + ": " + task;
                
                var sendData = JSON.stringify({ "assign" : assign,
                                                "task" :  sendTask,
                                                "startdate" : startdate,
                                                "duedate" : duedate,
                                    });
               // alert(sendData);
                
                $.ajax({
                    url:'https://prod-01.australiasoutheast.logic.azure.com:443/workflows/843568442c4d40daabd0211ad89d5484/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jrpszMuC8dZOv8ar9AsLLRzKTu95h6SCW8zC4DdFLhE',
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
            for (let i = 0, len = Math.max(category.values.length, dataValue.values.length); i < len; i++) {
                let input = this.target.getElementsByClassName("product");
                input[0].setAttribute('value',String(category.values[0]));
            }
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