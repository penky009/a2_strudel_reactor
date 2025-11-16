import console_monkey_patch, { getD3Data } from 'C:/Users/kpeng/source/repos/a2_strudel_reactor/src/console-monkey-patch.js';
import * as d3 from "d3";
import { useEffect, useState } from "react";
function D3Graph() {
    const [note, setNote] = useState("");
    const [notesArray, setNotesArray] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const noteData = getD3Data();
            if (noteData && noteData.length > 0) {
                const lastNote = String(noteData[noteData.length - 1]);
                const notePart = lastNote.split("note:")[1];
                const noteName = notePart ? notePart.split(" ")[0] : '';
                setNote(noteName);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        let tempArray = [...notesArray, note];
        if (tempArray.length > 12) {
            tempArray.shift();
        }
        setNotesArray(tempArray);
    }, [note]);

    useEffect(() => {
        const svg = d3.select('svg')
        svg.selectAll("*").remove();

        let w = svg.node().getBoundingClientRect().width
        let h = svg.node().getBoundingClientRect().height
        const barMargin = 10;
        const barWidth = w / notesArray.length

        let yScale = d3.scaleBand()
            .domain(["bb2", "eb2", "f2", "g2", "c3", "d3", "eb3", "f3", "g3", "bb3", "c4", "d4", "g4", "bb4", "d5"])
            .range([h, 0]);

        let barGroups = svg.selectAll('g')
            .data(notesArray);

        let newBarGroups = barGroups.enter()
            .append('g')
            .attr('transform', (d, i) => `translate(${i * barWidth}, 0)`);

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