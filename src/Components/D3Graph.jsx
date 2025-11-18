import console_monkey_patch, { getD3Data } from 'C:/Users/kpeng/source/repos/a2_strudel_reactor/src/console-monkey-patch.js';
import * as d3 from "d3";
import { useEffect, useState } from "react";
function D3Graph() {
    // State for note name
    const [note, setNote] = useState("");
    // State for array of notes
    const [notesArray, setNotesArray] = useState([]);

    // Retrieve note name from the note data in 100ms intervals
    useEffect(() => {
        const interval = setInterval(() => {
            const noteData = getD3Data();
            // Find the last note name from the data
            if (noteData && noteData.length > 0) {
                const lastNote = String(noteData[noteData.length - 1]);
                const notePart = lastNote.split("note:")[1];
                const noteName = notePart ? notePart.split(" ")[0] : '';
                setNote(noteName);
            }
        }, 100);
        // Clear the interval when it unmounts
        return () => clearInterval(interval);
    }, []);

    // Update the array of notes for every note change
    useEffect(() => {
        let tempArray = [...notesArray, note];
        if (tempArray.length > 12) {
            tempArray.shift();
        }
        setNotesArray(tempArray);
    }, [note]);

    // D3 Graph creation
    useEffect(() => {
        // Select 'svg' element to graph from
        const svg = d3.select('svg')
        // Remove previously existing graph elements
        svg.selectAll("*").remove();

        // Find width and height of the 'svg' element
        let w = svg.node().getBoundingClientRect().width
        let h = svg.node().getBoundingClientRect().height
        const barMargin = 10;
        const barWidth = w / notesArray.length

        // y-Axis scale set to the arpeggiator's notes
        let yScale = d3.scaleBand()
            .domain(["bb2", "eb2", "f2", "g2", "c3", "d3", "eb3", "f3", "g3", "bb3", "c4", "d4", "g4", "bb4", "d5"])
            .range([h, 0]);

        // New selection for bar groups based on array of notes
        let barGroups = svg.selectAll('g')
            .data(notesArray);

        // New data point for each note
        let newBarGroups = barGroups.enter()
            .append('g')
            .attr('transform', (d, i) => `translate(${i * barWidth}, 0)`);

        // Draw a rectangle for each new data point
        newBarGroups
            .append('rect')
            .attr('x', 0)
            .attr('y', d => yScale(d))
            .attr('width', 5)
            .attr('height', yScale.bandwidth())
            .attr('fill', 'black');

    }, [notesArray]);

    return (
        <div className="container m-2">
            <h4>Arppegiator Note: {note}</h4>

            <div className="row">
                <svg width="100%" height="400px" className="border"></svg>
            </div>
        </div>
    )
}
export default D3Graph;