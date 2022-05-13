using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Cat_animation : MonoBehaviour
{
    public Animator Cat_Animator;
    [SerializeField]
    private float Speed;
    [SerializeField]
    private float Direction;
    [SerializeField]
    private bool Sit;
    [SerializeField]
    private bool Lie;
    // Start is called before the first frame update
    void Start()
    {
        Cat_Animator = GetComponent<Animator>();
        Speed = Cat_Animator.GetFloat("speed");
        Direction = Cat_Animator.GetFloat("direction");
        Sit = Cat_Animator.GetBool("sit");
        Lie = Cat_Animator.GetBool("lie");
    }

    // Update is called once per frame
    void Update()
    {
        Cat_Animator.SetFloat("speed",Speed);
        Cat_Animator.SetFloat("direction",Direction);
        Cat_Animator.SetBool("sit",Sit);
        Cat_Animator.SetBool("lie",Lie);
    }
}
