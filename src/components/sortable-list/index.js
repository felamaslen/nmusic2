import { List as list } from 'immutable';
import debounce from '../../helpers/debounce';
import React from 'react';
import PureComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { orderListItems } from '../../helpers';

export default class SortableList extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            draggingIndex: -1,
            draggingKey: null,
            startX: 0,
            startY: 0,
            posX: null,
            posY: null,
            deltaY: 0,
            offsetX: 0,
            offsetY: 0,
            children: props.children,
            dragItem: null
        };

        this.dragListener = debounce(({ clientX, clientY }) => this.onDrag(clientX, clientY), 1, true);

        this.childRefs = {};
    }
    onDragStart(index, key, posX, posY) {
        if (this.state.draggingKey) {
            return;
        }

        const elem = this.childRefs[key];

        const { top, left, width: dragItemWidth, height: dragItemHeight } = elem.getBoundingClientRect();

        const offsetX = posX - left;
        const offsetY = posY - top;

        this.setState({
            draggingIndex: index,
            draggingKey: key,
            startX: posX,
            startY: posY,
            posX,
            posY,
            deltaY: 0,
            offsetX,
            offsetY,
            dragItemWidth,
            dragItemHeight
        });
    }
    onDragEnd() {
        if (this.state.deltaY) {
            this.props.onOrder(this.state.draggingIndex, this.state.deltaY);
        }

        this.setState({
            draggingIndex: -1,
            draggingKey: null,
            dragItem: null,
            deltaY: 0
        });
    }
    onDrag(posX, posY) {
        if (!this.state.draggingKey) {
            return;
        }

        const deltaYFloat = (posY - this.state.startY) / this.state.dragItemHeight;
        const deltaYAbs = Math.abs(deltaYFloat);
        const deltaY = deltaYFloat
            ? Math.round(Math.floor(deltaYAbs) * deltaYAbs / deltaYFloat)
            : 0;

        this.setState({
            posX, posY, deltaY
        });
    }
    componentDidMount() {
        window.addEventListener('mousemove', this.dragListener);
        window.addEventListener('touchmove', this.dragListener);
    }
    componentWillUnmount() {
        window.removeEventListener('mousemove', this.dragListener);
        window.addEventListener('touchmove', this.dragListener);
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.children.equals(this.props.children)) {
            this.setState({
                children: this.props.children,
                deltaY: 0,
                draggingIndex: -1,
                draggingKey: null
            });
        }
    }
    render() {
        const className = classNames('sortable-list', this.props.className);

        const onDragStart = (index, key) => ({ clientX, clientY }) =>
            this.onDragStart(index, key, clientX, clientY);

        const onDragEnd = () => this.onDragEnd();

        const childClass = key => classNames({
            dragging: key === this.state.draggingKey
        });

        const childRef = key => item => {
            this.childRefs[key] = item;
        };

        let children = this.state.children.slice();

        if (this.state.draggingKey) {
            children = orderListItems(children, this.state.draggingIndex, this.state.deltaY);
        }

        children = children
            .map((item, index) => {
                const key = this.props.childKey(item, index);

                const itemRef = childRef(key);

                const onItemDragStart = onDragStart(index, key);

                const props = {
                    ...this.props.childProps(item, index, Boolean(this.state.draggingKey)),
                    itemRef,
                    className: childClass(key),
                    onMouseDown: onItemDragStart,
                    onTouchStart: onItemDragStart
                };

                return <this.props.ListItem key={key} {...props} />;
            });

        let dragItem = null;
        if (this.state.draggingIndex > -1) {
            const dragItemProps = this.props.childProps(
                this.props.children.get(this.state.draggingIndex), this.state.draggingIndex
            );

            const dragItemStyle = {
                width: this.state.dragItemWidth,
                height: this.state.dragItemHeight,
                left: this.state.posX - this.state.offsetX,
                top: this.state.posY - this.state.offsetY - this.state.dragItemHeight
            };

            dragItem = <this.props.ListItem className="drag-item" {...dragItemProps} style={dragItemStyle} />;
        }

        return <div className="sortable-list-outer" onMouseUp={onDragEnd} onTouchEnd={onDragEnd}>
            <ul className={className}>
                {children}
            </ul>
            {dragItem}
        </div>;
    }
}

SortableList.propTypes = {
    className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    children: PropTypes.instanceOf(list).isRequired,
    childProps: PropTypes.func.isRequired,
    childKey: PropTypes.func.isRequired,
    ListItem: PropTypes.func.isRequired,
    onOrder: PropTypes.func.isRequired
}

