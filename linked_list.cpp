#include <iostream>
using namespace std;

// ---------------------------------------------------
// Singly Linked List: Insert / Delete / Search / Traverse
// ---------------------------------------------------

// Create a node
class Node
{
public:
    int value;
    Node* next;
};

// ================= INSERTION =================

// 1) Insert at the beginning  -> O(1)
void InsertAtBeginning(Node*& head, int value)
{
    Node* new_node = new Node();   // allocate memory to a node
    new_node->value = value;
    new_node->next = head;         // new node points to the old first node
    head = new_node;               // move head to the new node
}

// 2) Insert after a given node
void InsertAfter(Node* prev_node, int Value)
{
    if (prev_node == NULL) {
        cout << "the given previous node cannot be NULL";
        return;
    }

    Node* new_node = new Node();
    new_node->value = Value;
    new_node->next = prev_node->next;   // first: link new node to the rest
    prev_node->next = new_node;         // then: link prev to the new node
}

// 3) Insert at the end  -> O(n)
void InsertAtEnd(Node*& head, int Value)
{
    Node* new_node = new Node();
    new_node->value = Value;
    new_node->next = NULL;

    if (head == NULL) {            // empty list
        head = new_node;
        return;
    }

    Node* LastNode = head;
    while (LastNode->next != NULL)
        LastNode = LastNode->next;

    LastNode->next = new_node;
}

// ================= DELETION =================

// 1) Delete a node by value
void DeleteNode(Node*& head, int Value)
{
    Node* Current = head, * Prev = head;

    if (head == NULL)
        return;

    if (Current->value == Value) {     // the value is in the first node
        head = Current->next;
        delete Current;                // free from memory
        return;
    }

    // Find the node to be deleted
    while (Current != NULL && Current->value != Value) {
        Prev = Current;
        Current = Current->next;
    }

    if (Current == NULL)               // the value is not present
        return;

    Prev->next = Current->next;        // remove the node from the chain
    delete Current;                    // free from memory
}

// 2) Delete the first node  -> O(1)
void DeleteFirstNode(Node*& head)
{
    Node* Current = head;

    if (head == NULL)
        return;

    head = Current->next;
    delete Current;                    // free from memory
}

// 3) Delete the last node  -> O(n)
void DeleteLastNode(Node*& head)
{
    Node* Current = head, * Prev = head;

    if (head == NULL)
        return;

    if (Current->next == NULL) {       // only one node
        head = NULL;
        delete Current;
        return;
    }

    while (Current->next != NULL) {
        Prev = Current;
        Current = Current->next;
    }

    Prev->next = NULL;
    delete Current;                    // free from memory
}

// ================= SEARCHING =================

// Returns a pointer to the node that holds Value, or NULL if not found
Node* Find(Node* head, int Value)
{
    while (head != NULL) {
        if (head->value == Value)
            return head;
        head = head->next;
    }
    return NULL;
}

// ================= TRAVERSING =================

// Traversing: visit every node once, from head until NULL
void PrintList(Node* head)
{
    cout << "\n";
    while (head != NULL) {
        cout << head->value << " ";
        head = head->next;
    }
}

int main()
{
    Node* head = NULL;

    InsertAtEnd(head, 1);
    InsertAtEnd(head, 2);
    InsertAtEnd(head, 3);

    cout << "Traversing the list:";
    PrintList(head);                   // 1 2 3

    // Searching
    Node* found = Find(head, 2);
    if (found != NULL)
        cout << "\nFound: " << found->value;
    else
        cout << "\nNot found";

    return 0;
}
