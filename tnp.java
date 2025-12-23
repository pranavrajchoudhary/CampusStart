import java.util.*;




public class tnp{


    public static boolean isPrime(int n){
        if( n == 2){
            return true;
        }
        if( n <= 1){
            return false;
        }
        for(int i = 2; i <= Math.sqrt(n); i++ ){
            if(n%i==0){
                return false;
            }
        }return true;
    }

    public static int sumNatural(int n){
        int sum =0;
        for(int i = 1;i<=n;i++){
            sum += i;
        }
        return sum;

    }

    public static int fact(int n){
        int factorial = 1;

        for(int i =1; i<=n ; i++){
            factorial *= i;
        }
        return factorial;


    }

    public static int sap(int n){
        
        for(int i = 0; n >= 0;i++){
            System.out.println(n%10);
            n = n/10;

        }
        return 0;
    }

    public static void pp(){
        int num = 1;
        for(int i =1; i<=5 ;i++){
            for(int j=0;j<i;j++){
                System.out.print(num);
                num++;
            }
            System.out.println("");
        }
    }

    public static String string1(String ch1 , String ch2){
        String str = "PUJA SONI 1";
        // System.out.println(str);
        return str;
        
    }
      public static String string1(String ch2){
        String str = "PUJA SONI 2";
        // System.out.println(str);
        return str;
        
    }
      public static String string1(String ch3 , String ch4 , String ch5){
        String str = "PUJA SONI 3";
        // System.out.println(str);
        return str;
    }

      public static float multi(float a, float b){
        
        return a*b;
        
    }
    
      public static float multi(float a, float b , float c){
        
        return a*b*c;
        
    }

    public static int larg(int a, int b, int c) {
        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        return max;
    }


    public static int temp(int a){
        int f = (9*a)/5 + 32;
        return f;
       
    }
public static boolean isPalindrome(String str) {
    str = str.toLowerCase();  

    int i = 0;
    int j = str.length() - 1;

    for (; i < j; i++, j--) {
        if (str.charAt(i) != str.charAt(j)) {
            return false;
        }
    }

    return true;
}


    public static int findLargest(int[] arr) {
        int max = arr[0];
        int secLarge = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if(arr[i] == arr[arr.length - 1]){
                secLarge = max;
                System.out.println(max);
            }
            if (arr[i] > max) {
                max = arr[i];

            }
        }
        return max;
    }
 

    public static void main(String args[]){

        // System.out.print("Enter day number :- ");
        Scanner sc = new Scanner(System.in);
        // int d = sc.nextInt();
        
        // switch(d){
        //     case 1 : System.out.println("Monday");
        //         break;
        //     case 2 : System.out.println("Tuesday");
        //         break;
        //     case 3 : System.out.println("Wedneday");
        //         break;
        //     case 4 : System.out.println("Thursday");
        //         break;
        //     case 5 : System.out.println("Friday");
        //         break;
        //     case 6 : System.out.println("Saturday");
        //         break;
        //     case 7 : System.out.println("Sunday");
        //         break;
            
        // }

// int n = sc.nextInt();
// // System.out.println(n + (isPrime(n) ? " is Prime" : " is Not Prime"));
//     System.out.println(sumNatural(50));
//         System.out.println(sap(123));
// pp();

// System.out.println(string1("one"));
// System.out.println(string1("one","two"));
// System.out.println(string1("one","two","three"));

// System.out.println(multi(5,10f));
// System.out.println(multi(5,5,5));

// System.out.println(temp(10));

        // System.out.print("Enter a string: ");
        // String str = sc.nextLine();   

        // boolean result = isPalindrome(str);

        // System.out.println("Palindrome? " + result);

        System.out.println("Enter size of array : -");
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            System.out.print("Enter "+ i +"th Element :");
            arr[i] = sc.nextInt();
        }

        System.out.println("The largest is : - "+findLargest(arr) );


    }
}