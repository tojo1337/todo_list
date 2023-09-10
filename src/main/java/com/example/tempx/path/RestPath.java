package com.example.tempx.path;

import com.example.tempx.data.Data;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:3000")
public class RestPath {
    private List<Data> list = new ArrayList<>();
    @GetMapping("getter")
    public List greet(){
        return list;
    }
    @PostMapping("setter")
    public HttpStatus dataSetter(@RequestBody Data dt){
        list.add(dt);
        return HttpStatus.ACCEPTED;
    }
}