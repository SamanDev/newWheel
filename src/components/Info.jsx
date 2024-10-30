import { Button, Icon } from "semantic-ui-react";

const ModalExampleScrollingContent = () => {
    return (
        <span id="leave-button">
            <Button basic inverted color="grey" size="mini" style={{ position: "relative", marginBottom: 10, textAlign: "left" }} icon labelPosition="left">
                <Icon name="arrow circle down" />
                Last 20
            </Button>
        </span>
    );
};

export default ModalExampleScrollingContent;
