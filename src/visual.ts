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
interface Payload {
    assign: string, task: string, taskdescription: string,
    startdate: string, duedate: string, categoryid: string, username: string
};

"use strict";
import "core-js/stable";
import "./../style/visual.less";
import 'regenerator-runtime/runtime'
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    static targetUrl: string;
    static staffUrl: string;
    static categoryId: string;
    static userName: string;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        if (typeof document !== "undefined") {
            let now = new Date();
            let day = ("0" + now.getDate()).slice(-2);
            let month = ("0" + (now.getMonth() + 1)).slice(-2);
            let today = now.getFullYear() + "-" + (month) + "-" + (day);
            const new_p0: HTMLElement = document.createElement("p");
            new_p0.appendChild(document.createTextNode("Start Date:"));
            const new_sd: HTMLInputElement = document.createElement("input");
            new_sd.setAttribute("type", "date");
            new_sd.setAttribute("class", "date");
            new_sd.value = today;
            new_p0.appendChild(new_sd);
            this.target.appendChild(new_p0);
            const new_p1: HTMLElement = document.createElement("p");
            new_p1.appendChild(document.createTextNode("Due Date:"));
            const new_dd: HTMLInputElement = document.createElement("input");
            new_dd.setAttribute("type", "date");
            new_dd.setAttribute("class", "date");
            new_dd.value = today;
            new_p1.appendChild(new_dd);
            this.target.appendChild(new_p1);
            const new_p2: HTMLElement = document.createElement("p");
            new_p2.appendChild(document.createTextNode("Assign:"));
            const new_as: HTMLSelectElement = document.createElement("select")
            new_as.id = "staffList";
            Visual.staffUrl = "";
            new_as.setAttribute("class", "email");
            new_p2.appendChild(new_as);
            this.target.appendChild(new_p2);
            const new_p3: HTMLElement = document.createElement("p");
            new_p3.appendChild(document.createTextNode("Task"));
            const new_pd: HTMLInputElement = document.createElement("input");
            new_pd.setAttribute("type", "text");
            new_pd.setAttribute("class", "task");
            new_pd.setAttribute("id", "task");
            //   new_pd.readOnly = true;
            new_p3.appendChild(new_pd);
            this.target.appendChild(new_p3);
            const new_p4: HTMLElement = document.createElement("p");
            new_p4.appendChild(document.createTextNode("Detail"));
            const new_at: HTMLTextAreaElement = document.createElement("textarea");
            new_at.setAttribute("type", "textarea");
            new_at.setAttribute("class", "multiline");
            new_at.setAttribute('id', "detail");
            new_p4.appendChild(new_at);
            this.target.appendChild(new_p4);
            // Button               
            const new_b = document.createElement("input");
            new_b.setAttribute('type', "submit");
            new_b.setAttribute('value', "Submit Task");
            new_b.setAttribute('id', "bUpdate");

            new_b.onclick = function () {
                let payload: Payload = {
                    assign: new_as.value,
                    task: new_pd.value,
                    taskdescription: new_at.value,
                    startdate: new_sd.value,
                    duedate: new_dd.value,
                    categoryid: Visual.categoryId,
                    username: Visual.userName
                }
                btnClick(payload,
                    Visual.targetUrl
                );
            };

            this.target.appendChild(new_b);
            const new_p5 = document.createElement("p");
            new_p5.setAttribute('id', "final_msg");
            new_p5.hidden = true;
            var new_message = document.createTextNode("Task Assigned");
            new_p5.appendChild(new_message);
            this.target.appendChild(new_p5);
            const new_p6 = document.createElement("p");
            new_p6.setAttribute('id', "fail_msg");
            new_p6.hidden = true;
            var new_message = document.createTextNode("POST failed, check URL");
            new_p6.appendChild(new_message);
            this.target.appendChild(new_p6);
        }
        function btnClick(payload: Payload, targetUrl) {
            let sendData = JSON.stringify(payload);
            fetch(targetUrl, {

                method: "POST",
                body: sendData,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async function (response) {
                    if (response.status >= 400 && response.status < 600) {
                        let fail_msg = document.getElementById('fail_msg');
                        fail_msg.hidden = false;
                        const text = await response.text();
                        console.log('Text Function', text, 'Status', response.status);
                    }
                    else {
                        const text = await response.text();
                        let final_msg = document.getElementById('final_msg');
                        final_msg.hidden = false;
                    }

                })
                .catch((error) => {
                    let fail_msg = document.getElementById('fail_msg');
                    fail_msg.hidden = false;
                    console.error('Error:', error);
                });
        }
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        let final_msg = document.getElementById('final_msg');
        final_msg.hidden = true;
        let fail_msg = document.getElementById('fail_msg');
        fail_msg.hidden = true;
        let dataViews = options.dataViews;
        let categorical = dataViews[0].categorical;
        let category = categorical.categories[0];
        let input = document.getElementById("task") as HTMLInputElement;
        input.value = String(category.values[0]);
        Visual.targetUrl = this.settings.url.targetUrl;

        if (Visual.staffUrl !== this.settings.staffList.targetUrl) {
            Visual.staffUrl = this.settings.staffList.targetUrl;
            document.getElementById('staffList').innerHTML = "";
            let selectList: HTMLElement = document.getElementById('staffList');
            fetch(Visual.staffUrl)
                .then(function (response) {                  
                        return response.json();                
                })
                .then(function (staffList) {
                    let person;
                    for (person of staffList) {
                        var option = document.createElement("option");
                        option.value = person.Email;
                        option.text = person.Name;
                        selectList.appendChild(option);
                    }
                })
                .catch((error) => {
                    var option = document.createElement("option");
                    option.value = "unknown";
                    option.text = "No Staff List";
                    selectList.appendChild(option);
                    console.error('Error:', error);
                });;
        }
        let detail: HTMLTextAreaElement = document.getElementById('detail') as HTMLTextAreaElement;
        let name = categorical.values[0].source.displayName;
        let value = categorical.values[0].values[0]
        detail.value = name + ": " + value;
        // the second value if present is the categoryid
        Visual.categoryId = categorical.values[1].values[0].toString()
        // the third value is the username
        Visual.userName = categorical.values[2].values[0].toString()
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
