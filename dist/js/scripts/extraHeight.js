/** This div is added at the end of the feed to trigger
   pagination. It's needed to avoid stuck paginations
   when there's too few posts on the screen */
export const EXTRA_HEIGHT_DIV = createExtaHeightDiv();
function createExtaHeightDiv() {
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = window.innerHeight + 'px';
    div.classList.add('wzl-extra-height');
    div.style.background = 'transparent';
    return div;
}
// adapt EXTRA_HEIGHT_DIV to the size of the screen
window.addEventListener('resize', (e) => {
    EXTRA_HEIGHT_DIV.style.height = window.innerHeight + 'px';
});
export function removeExtraHeight() {
    EXTRA_HEIGHT_DIV.parentElement?.removeChild(EXTRA_HEIGHT_DIV);
}
