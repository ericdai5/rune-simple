export function setCaretToEnd (element: HTMLElement): void {
        const range = document.createRange();
        const selection = window.getSelection();
        if (selection) {
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        element.focus();
    };
  